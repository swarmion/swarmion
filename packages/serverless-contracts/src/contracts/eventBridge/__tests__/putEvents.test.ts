import {
  EventBridgeClient,
  PutEventsCommand,
} from '@aws-sdk/client-eventbridge';
import { mockClient } from 'aws-sdk-client-mock';
import { randomBytes } from 'crypto';
import { beforeEach, expect } from 'vitest';

import { eventBridgeContract } from './mock';
import { buildPutEvents } from '../features';

const eventBridgeClientMock = mockClient(EventBridgeClient);
const eventBridgeClient = new EventBridgeClient({});

const eventBusName = 'myBus';
const source = 'titi.tutu';

// Not sure why the length is divided by 2
// But empirically it works: Buffer.byteLength(generateRandomText(N), 'utf8') = N
const generateRandomText = (length: number): string =>
  randomBytes(length / 2).toString('hex');

const createPayloads = ({
  length,
  offset = 0,
}: {
  length: number;
  offset?: number;
}) =>
  Array.from({ length }).map((_, index) => ({
    userId: `id${offset + index}`,
    myOtherProp: `myOtherPropValue${offset + index}`,
  }));

describe('EventBridge contract putEvents tests', () => {
  beforeEach(() => {
    eventBridgeClientMock.reset();
    eventBridgeClientMock.on(PutEventsCommand).resolves({});
  });
  it('calls EventBridge with batches of 10 messages', async () => {
    const myPutEvents = buildPutEvents(eventBridgeContract, {
      eventBusName,
      eventBridgeClient,
      source,
    });

    await myPutEvents(createPayloads({ length: 20 }));

    const calls = eventBridgeClientMock.commandCalls(PutEventsCommand);
    expect(calls.length).toBe(2);
    expect(calls[0]!.args[0].input.Entries!.length).toBe(10);
    expect(calls[1]!.args[0].input.Entries!.length).toBe(10);
  });
  it('calls EventBridge with controlled throughput', async () => {
    const myPutEvents = buildPutEvents(eventBridgeContract, {
      eventBusName,
      eventBridgeClient,
      source,
      throughputCallsPerSecond: 1,
    });

    const start = Date.now();
    await myPutEvents(createPayloads({ length: 30 }));
    const end = Date.now();

    const calls = eventBridgeClientMock.commandCalls(PutEventsCommand);
    expect(calls.length).toBe(3);
    expect(calls[0]!.args[0].input.Entries!.length).toBe(10);
    expect(calls[1]!.args[0].input.Entries!.length).toBe(10);
    expect(calls[2]!.args[0].input.Entries!.length).toBe(10);
    expect(end - start).toBeGreaterThan(2000); // 2s
  });
  it('calls EventBridge with more batches if some messages are too big', async () => {
    const myPutEvents = buildPutEvents(eventBridgeContract, {
      eventBusName,
      eventBridgeClient,
      source,
    });
    await myPutEvents([
      {
        userId: 'id0',
        myOtherProp: generateRandomText(256 * 1000 - 100), // 256Kb - 100b: the first message must be close to the limit to avoid other messages to be batched with it
      },
      ...createPayloads({ length: 19, offset: 1 }),
    ]);

    const calls = eventBridgeClientMock.commandCalls(PutEventsCommand);
    expect(calls.length).toBe(3);
    expect(calls[0]!.args[0].input.Entries!.length).toBe(1);
    expect(calls[1]!.args[0].input.Entries!.length).toBe(10);
    expect(calls[2]!.args[0].input.Entries!.length).toBe(9);
  });
  it('calls EventBridge with more batches if some messages are too big 2', async () => {
    const myPutEvents = buildPutEvents(eventBridgeContract, {
      eventBusName,
      eventBridgeClient,
      source,
    });
    await myPutEvents([
      {
        userId: 'id0',
        myOtherProp: generateRandomText(256 * 1000 - 450), // 256Kb - 350b: Let other messages be batched with it
      },
      ...createPayloads({ length: 19, offset: 1 }),
    ]);

    const calls = eventBridgeClientMock.commandCalls(PutEventsCommand);
    expect(calls.length).toBe(3);
    expect(calls[0]!.args[0].input.Entries!.length).toBe(6);
    expect(calls[1]!.args[0].input.Entries!.length).toBe(10);
    expect(calls[2]!.args[0].input.Entries!.length).toBe(4);
  });
  it('throws if one of the messages is too big', async () => {
    const myPutEvents = buildPutEvents(eventBridgeContract, {
      eventBusName,
      eventBridgeClient,
      source,
    });

    await expect(
      myPutEvents([
        {
          userId: 'id0',
          myOtherProp: generateRandomText(256 * 1024), // 256Kb + the size of the envelope > 256kb
        },
        {
          userId: 'id0',
          myOtherProp: 'myOtherPropValue2',
        },
      ]),
    ).rejects.toThrow();
  });
  it('throws by default if it fails to send some message to EventBridge', async () => {
    eventBridgeClientMock.on(PutEventsCommand).resolvesOnce({
      FailedEntryCount: 5,
      Entries: [
        { ErrorCode: 'ValidationError', ErrorMessage: 'WTF0' },
        { EventId: 'eventId1' },
        { ErrorCode: 'ValidationError', ErrorMessage: 'WTF2' },
        { ErrorCode: 'ValidationError', ErrorMessage: 'WTF3' },
        { EventId: 'eventId4' },
        { ErrorCode: 'ValidationError', ErrorMessage: 'WTF5' },
        { EventId: 'eventId6' },
        { EventId: 'eventId7' },
        { EventId: 'eventId8' },
        { ErrorCode: 'ValidationError', ErrorMessage: 'WTF9' },
      ],
    });

    const myPutEvents = buildPutEvents(eventBridgeContract, {
      eventBusName,
      eventBridgeClient,
      source,
    });

    await expect(myPutEvents(createPayloads({ length: 10 }))).rejects.toThrow();
  });
  it('returns the entries and error count if it fails to send some message to EventBridge and throwOnFailure is false', async () => {
    const entriesReturnedByEventBridge = [
      { ErrorCode: 'ValidationError', ErrorMessage: 'WTF0' },
      { EventId: 'eventId1' },
      { ErrorCode: 'ValidationError', ErrorMessage: 'WTF2' },
      { ErrorCode: 'ValidationError', ErrorMessage: 'WTF3' },
      { EventId: 'eventId4' },
      { ErrorCode: 'ValidationError', ErrorMessage: 'WTF5' },
      { EventId: 'eventId6' },
      { EventId: 'eventId7' },
      { EventId: 'eventId8' },
      { ErrorCode: 'ValidationError', ErrorMessage: 'WTF9' },
    ];
    eventBridgeClientMock.on(PutEventsCommand).resolvesOnce({
      FailedEntryCount: 5,
      Entries: entriesReturnedByEventBridge,
    });

    const myPutEvents = buildPutEvents(eventBridgeContract, {
      eventBusName,
      eventBridgeClient,
      source,
      throwOnFailure: false,
    });

    const { failedEntryCount, entries } = await myPutEvents(
      createPayloads({ length: 10 }),
    );

    expect(failedEntryCount).toEqual(5);
    expect(entries).toEqual(entriesReturnedByEventBridge);
  });
});
