import { SendMessageBatchCommand, SQSClient } from '@aws-sdk/client-sqs';
import Ajv from 'ajv';
import { mockClient } from 'aws-sdk-client-mock';
import { randomBytes } from 'crypto';
import { beforeEach, expect } from 'vitest';

import { sqsContract } from './mock';
import { buildSendMessages } from '../features';

const ajv = new Ajv({ keywords: ['faker'] });

const sqsClientMock = mockClient(SQSClient);
const sqsClient = new SQSClient({});

const queueUrl = 'mySqsUrl';

// Not sure why the length is divided by 2
// But empirically it works: Buffer.byteLength(generateRandomText(N), 'utf8') = N
const generateRandomText = (length: number): string =>
  randomBytes(length / 2).toString('hex');

const createMessages = ({
  length,
  offset = 0,
}: {
  length: number;
  offset?: number;
}) =>
  Array.from({ length }).map((_, index) => ({
    Id: `id${offset + index}`,
    body: { toto: `totoValue${offset + index}` },
  }));

describe('SQS contract sendMessages tests', () => {
  beforeEach(() => {
    sqsClientMock.reset();
    sqsClientMock.on(SendMessageBatchCommand).resolves({ Failed: [] });
  });
  it('serializes the messages', async () => {
    const mySendMessages = buildSendMessages(sqsContract, {
      queueUrl,
      sqsClient,
      ajv,
    });

    await mySendMessages([
      {
        body: { toto: 'totoValue1' },
        messageAttributes: { tata: 'tataValue1' },
      },
      {
        body: { toto: 'totoValue2' },
        messageAttributes: { tata: 'tataValue2' },
      },
    ]);

    const calls = sqsClientMock.commandCalls(SendMessageBatchCommand);
    expect(calls.length).toBe(1);
    expect(calls[0]!.args[0].input.Entries).toEqual([
      {
        Id: expect.any(String) as string,
        MessageAttributes: {
          tata: {
            DataType: 'String',
            StringValue: 'tataValue1',
          },
        },
        MessageBody: '{"toto":"totoValue1"}',
      },
      {
        Id: expect.any(String) as string,
        MessageAttributes: {
          tata: {
            DataType: 'String',
            StringValue: 'tataValue2',
          },
        },
        MessageBody: '{"toto":"totoValue2"}',
      },
    ]);
  });
  it('throws if one of the messages is invalid', async () => {
    const mySendMessages = buildSendMessages(sqsContract, {
      queueUrl,
      sqsClient,
      ajv,
    });

    await expect(
      mySendMessages([
        {
          body: { toto: 'totoValue1' },
          messageAttributes: { tata: 'tataValue1' },
        },
        {
          // @ts-expect-error - this is the point of the test
          body: { tata: 'totoValue2' },
          messageAttributes: { tata: 'tataValue2' },
        },
      ]),
    ).rejects.toThrow();
  });
  it('calls SQS with batches of 10 messages', async () => {
    const mySendMessages = buildSendMessages(sqsContract, {
      queueUrl,
      sqsClient,
      ajv,
    });

    await mySendMessages(createMessages({ length: 20 }));

    const calls = sqsClientMock.commandCalls(SendMessageBatchCommand);
    expect(calls.length).toBe(2);
    expect(calls[0]!.args[0].input.Entries!.length).toBe(10);
    expect(calls[1]!.args[0].input.Entries!.length).toBe(10);
  });
  it('calls SQS with controlled throughput', async () => {
    const mySendMessages = buildSendMessages(sqsContract, {
      queueUrl,
      sqsClient,
      ajv,
      throughputCallsPerSecond: 1,
    });

    const start = Date.now();
    await mySendMessages(createMessages({ length: 30 }));
    const end = Date.now();

    const calls = sqsClientMock.commandCalls(SendMessageBatchCommand);
    expect(calls.length).toBe(3);
    expect(calls[0]!.args[0].input.Entries!.length).toBe(10);
    expect(calls[1]!.args[0].input.Entries!.length).toBe(10);
    expect(calls[2]!.args[0].input.Entries!.length).toBe(10);
    expect(end - start).toBeGreaterThan(2000); // 2s
  });
  it('calls SQS with more batches if some messages are too big', async () => {
    const mySendMessages = buildSendMessages(sqsContract, {
      queueUrl,
      sqsClient,
      ajv,
    });
    await mySendMessages([
      {
        body: { toto: generateRandomText(256 * 1000 - 100) }, // 256Kb - 100b: the first message must be close to the limit to avoid other messages to be batched with it
      },
      ...createMessages({ length: 19, offset: 1 }),
    ]);

    const calls = sqsClientMock.commandCalls(SendMessageBatchCommand);
    expect(calls.length).toBe(3);
    expect(calls[0]!.args[0].input.Entries!.length).toBe(1);
    expect(calls[1]!.args[0].input.Entries!.length).toBe(10);
    expect(calls[2]!.args[0].input.Entries!.length).toBe(9);
  });
  it('calls SQS with more batches if some messages are too big 2', async () => {
    const mySendMessages = buildSendMessages(sqsContract, {
      queueUrl,
      sqsClient,
      ajv,
    });
    await mySendMessages([
      {
        body: { toto: generateRandomText(256 * 1000 - 350) }, // 256Kb - 350b: Let other messages be batched with it
      },
      ...createMessages({ length: 19, offset: 1 }),
    ]);

    const calls = sqsClientMock.commandCalls(SendMessageBatchCommand);
    expect(calls.length).toBe(3);
    expect(calls[0]!.args[0].input.Entries!.length).toBe(6);
    expect(calls[1]!.args[0].input.Entries!.length).toBe(10);
    expect(calls[2]!.args[0].input.Entries!.length).toBe(4);
  });
  it('throws if one of the messages is too big', async () => {
    const mySendMessages = buildSendMessages(sqsContract, {
      queueUrl,
      sqsClient,
      ajv,
    });

    await expect(
      mySendMessages([
        {
          body: { toto: generateRandomText(256 * 1024) }, // 256Kb + the size of the envelope > 256kb
        },
        {
          body: { toto: 'totoValue2' },
        },
      ]),
    ).rejects.toThrow();
  });
  it('retries the failed messages', async () => {
    sqsClientMock
      .on(SendMessageBatchCommand)
      .resolvesOnce({
        Failed: [
          { Id: 'id0', SenderFault: undefined, Code: undefined },
          { Id: 'id2', SenderFault: undefined, Code: undefined },
          { Id: 'id3', SenderFault: undefined, Code: undefined },
          { Id: 'id5', SenderFault: undefined, Code: undefined },
          { Id: 'id9', SenderFault: undefined, Code: undefined },
        ],
      })
      .resolvesOnce({
        Failed: [
          { Id: 'id3', SenderFault: undefined, Code: undefined },
          { Id: 'id9', SenderFault: undefined, Code: undefined },
        ],
      })
      .resolvesOnce({
        Failed: [],
      });
    const mySendMessages = buildSendMessages(sqsContract, {
      queueUrl,
      sqsClient,
      ajv,
    });

    await mySendMessages(createMessages({ length: 10 }));

    const calls = sqsClientMock.commandCalls(SendMessageBatchCommand);
    expect(calls.length).toBe(3);
    expect(calls[0]!.args[0].input.Entries!.length).toBe(10);
    expect(calls[1]!.args[0].input.Entries!.length).toBe(5);
    expect(calls[2]!.args[0].input.Entries!.length).toBe(2);
  });
  it('throws by default if it fails to send some message to the SQS', async () => {
    sqsClientMock
      .on(SendMessageBatchCommand)
      .resolvesOnce({
        Failed: [
          { Id: 'id0', SenderFault: undefined, Code: undefined },
          { Id: 'id2', SenderFault: undefined, Code: undefined },
          { Id: 'id3', SenderFault: undefined, Code: undefined },
          { Id: 'id5', SenderFault: undefined, Code: undefined },
          { Id: 'id9', SenderFault: undefined, Code: undefined },
        ],
      })
      .resolvesOnce({
        Failed: [
          { Id: 'id3', SenderFault: undefined, Code: undefined },
          { Id: 'id9', SenderFault: undefined, Code: undefined },
        ],
      })
      .resolves({
        Failed: [{ Id: 'id9', SenderFault: undefined, Code: undefined }],
      });
    const mySendMessages = buildSendMessages(sqsContract, {
      queueUrl,
      sqsClient,
      ajv,
    });

    await expect(
      mySendMessages(createMessages({ length: 10 })),
    ).rejects.toThrow();

    const calls = sqsClientMock.commandCalls(SendMessageBatchCommand);
    expect(calls.length).toBe(3);
    expect(calls[0]!.args[0].input.Entries!.length).toBe(10);
    expect(calls[1]!.args[0].input.Entries!.length).toBe(5);
    expect(calls[2]!.args[0].input.Entries!.length).toBe(2);
  });
  it('adapts the retry behaviour to the configuration', async () => {
    sqsClientMock
      .on(SendMessageBatchCommand)
      .resolvesOnce({
        Failed: [
          { Id: 'id0', SenderFault: undefined, Code: undefined },
          { Id: 'id2', SenderFault: undefined, Code: undefined },
          { Id: 'id3', SenderFault: undefined, Code: undefined },
          { Id: 'id5', SenderFault: undefined, Code: undefined },
          { Id: 'id9', SenderFault: undefined, Code: undefined },
        ],
      })
      .resolvesOnce({
        Failed: [
          { Id: 'id3', SenderFault: undefined, Code: undefined },
          { Id: 'id9', SenderFault: undefined, Code: undefined },
        ],
      })
      .resolves({
        Failed: [{ Id: 'id9', SenderFault: undefined, Code: undefined }],
      });
    const mySendMessages = buildSendMessages(sqsContract, {
      queueUrl,
      sqsClient,
      ajv,
      throwOnFailedBatch: false,
      maxRetries: 5,
      baseDelay: 1,
    });

    const { failedItems } = await mySendMessages(
      createMessages({ length: 10 }),
    );

    expect(failedItems).toEqual([
      {
        Code: undefined,
        Id: 'id9',
        SenderFault: undefined,
      },
    ]);

    const calls = sqsClientMock.commandCalls(SendMessageBatchCommand);
    expect(calls.length).toBe(5);
    expect(calls[0]!.args[0].input.Entries!.length).toBe(10);
    expect(calls[1]!.args[0].input.Entries!.length).toBe(5);
    expect(calls[2]!.args[0].input.Entries!.length).toBe(2);
    expect(calls[3]!.args[0].input.Entries!.length).toBe(1);
    expect(calls[4]!.args[0].input.Entries!.length).toBe(1);
  });
});
