import { SendMessageBatchRequestEntry } from '@aws-sdk/client-sqs';
import { ulid } from 'ulid';

import { serializeMessageAttributes } from './serializeMessageAttributes';
import { SQSContract } from '../sqsContract';
import { SqsMessage, SqsMessageBodyType } from '../types';

export const serializeMessage =
  <Contract extends SQSContract>({
    contract,
    bodySerializer,
  }: {
    contract: Contract;
    bodySerializer?: (body: SqsMessageBodyType<Contract>) => string | undefined;
  }) =>
  ({
    body,
    messageAttributes,
    ...restMessage
  }: SqsMessage<Contract>): SendMessageBatchRequestEntry => ({
    Id: ulid(),
    MessageBody:
      bodySerializer !== undefined ? JSON.stringify(body) : (body as string),
    ...(messageAttributes !== undefined && messageAttributes !== null
      ? {
          MessageAttributes: serializeMessageAttributes(
            messageAttributes as Record<string, unknown>, // messageAttributes generic infered type has {} as type. I don't know why
            contract,
          ),
        }
      : {}),
    ...restMessage,
  });
