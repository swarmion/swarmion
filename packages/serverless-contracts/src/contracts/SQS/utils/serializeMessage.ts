import { SendMessageBatchRequestEntry } from '@aws-sdk/client-sqs';
import { ulid } from 'ulid';

import { serializeMessageAttributes } from './serializeMessageAttributes';
import { StringOrNumberDictionaryJSONSchema } from '../../../types/constrainedJSONSchema';
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
      // @ts-expect-error weird bodySerializer error: Type instantiation is excessively deep and possibly infinite
      bodySerializer !== undefined ? bodySerializer(body) : (body as string),
    ...(messageAttributes !== undefined && messageAttributes !== null
      ? {
          MessageAttributes: serializeMessageAttributes(
            messageAttributes as unknown as StringOrNumberDictionaryJSONSchema, // messageAttributes generic infered type has {} as type. I don't know why
            contract,
          ),
        }
      : {}),
    ...restMessage,
  });
