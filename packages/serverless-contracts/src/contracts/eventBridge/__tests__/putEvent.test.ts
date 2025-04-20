import {
  EventBridgeClient,
  PutEventsCommand,
} from '@aws-sdk/client-eventbridge';
import { mockClient } from 'aws-sdk-client-mock';

import { EventBridgeContract } from '../eventBridgeContract';
import { buildPutEvent } from '../features';

const eventBridgeClient = new EventBridgeClient({});
const eventBusName = 'myBusName';

const eventBridgeClientMock = mockClient(EventBridgeClient);

const eventBridgeContract = new EventBridgeContract({
  id: 'myAwesomeEventBridgeContract',
  sources: ['toto.tata', 'titi.tutu'] as const,
  eventType: 'MY_DETAIL_TYPE',
  payloadSchema: {
    type: 'object',
    properties: {
      userId: { type: 'string' },
      myOtherProp: { type: 'string' },
    },
    required: ['userId', 'myOtherProp'],
    additionalProperties: false,
  } as const,
});

const myPutEvent = buildPutEvent(eventBridgeContract, {
  source: 'titi.tutu',
  eventBridgeClient,
  eventBusName,
});

describe('EventBridge contract putEvent tests', () => {
  beforeEach(() => {
    eventBridgeClientMock.reset();
  });

  it('should call eventBridge with the correct parameters', async () => {
    eventBridgeClientMock.on(PutEventsCommand).resolves({});

    await myPutEvent({ userId: 'miam', myOtherProp: 'coucou' });

    expect(eventBridgeClientMock.call(0).args[0].input).toEqual({
      Entries: [
        {
          Detail: '{"userId":"miam","myOtherProp":"coucou"}',
          DetailType: 'MY_DETAIL_TYPE',
          EventBusName: 'myBusName',
          Source: 'titi.tutu',
        },
      ],
    });
  });

  it('should throw if eventBridge failed to process the message', async () => {
    eventBridgeClientMock.on(PutEventsCommand).resolves({
      FailedEntryCount: 1,
      Entries: [
        {
          ErrorCode: 'ValidationError',
          ErrorMessage: 'Payload too large',
        },
      ],
    });

    await expect(() =>
      myPutEvent({ userId: 'miam', myOtherProp: 'coucou' }),
    ).rejects.toThrow();
  });

  it('returns the entry if eventBridge failed to process the message and throwOnFailure is set to false', async () => {
    eventBridgeClientMock.on(PutEventsCommand).resolves({
      FailedEntryCount: 1,
      Entries: [
        {
          ErrorCode: 'ValidationError',
          ErrorMessage: 'Payload too large',
        },
      ],
    });

    const myPutEventWithoutError = buildPutEvent(eventBridgeContract, {
      source: 'titi.tutu',
      eventBridgeClient,
      eventBusName,
      throwOnFailure: false,
    });

    const { failedEntryCount, entry } = await myPutEventWithoutError({
      userId: 'miam',
      myOtherProp: 'coucou',
    });

    expect(failedEntryCount).toEqual(1);
    expect(entry).toEqual({
      ErrorCode: 'ValidationError',
      ErrorMessage: 'Payload too large',
    });
  });
});
