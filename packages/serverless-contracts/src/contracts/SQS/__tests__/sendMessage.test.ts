import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import Ajv from 'ajv';
import { mockClient } from 'aws-sdk-client-mock';
import { beforeEach } from 'vitest';

import { sqsContract } from './mock';
import { buildSendMessage } from '../features';

const ajv = new Ajv({ keywords: ['faker'] });

const sqsClient = new SQSClient({});
const queueUrl = 'mySqsUrl';

const sqsClientMock = mockClient(SQSClient);

describe('SQS contract sendMessage tests', () => {
  beforeEach(() => {
    sqsClientMock.reset();
    sqsClientMock.on(SendMessageCommand).resolves({});
  });
  it('calls SQS with the correct parameters', async () => {
    const mySendMessage = buildSendMessage(sqsContract, {
      queueUrl,
      sqsClient,
      ajv,
    });

    await mySendMessage({
      body: { toto: 'totoValue' },
      messageAttributes: { tata: 'tataValue' },
    });

    expect(sqsClientMock.call(0).args[0].input).toEqual({
      QueueUrl: 'mySqsUrl',
      MessageBody: '{"toto":"totoValue"}',
      MessageAttributes: {
        tata: {
          DataType: 'String',
          StringValue: 'tataValue',
        },
      },
    });
  });
  it('throws if the message is invalid', async () => {
    const mySendMessage = buildSendMessage(sqsContract, {
      queueUrl,
      sqsClient,
      ajv,
    });

    await expect(
      mySendMessage({
        // @ts-expect-error - this is the point of the test
        body: { tata: 'totoValue' },
        messageAttributes: { tata: 'tataValue' },
      }),
    ).rejects.toThrow();
  });
});
