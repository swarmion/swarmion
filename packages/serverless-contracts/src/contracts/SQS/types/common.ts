import { SendMessageRequest } from '@aws-sdk/client-sqs';
import { FromSchema, JSONSchema } from 'json-schema-to-ts';

import { SQSContract } from '../sqsContract';

export type SqsMessageBodyType<Contract extends SQSContract> =
  Contract['messageBodySchema'] extends JSONSchema
    ? FromSchema<Contract['messageBodySchema']>
    : void;

export type SqsMessageAttributesType<Contract extends SQSContract> =
  Contract['messageAttributesSchema'] extends JSONSchema
    ? FromSchema<Contract['messageAttributesSchema']>
    : void;

export type SqsMessage<Contract extends SQSContract> = Omit<
  SendMessageRequest,
  'MessageBody' | 'QueueUrl'
> & {
  Id?: string;
  body: SqsMessageBodyType<Contract>;
  // TODO improve messageAttributes type to be required when SqsMessageAttributesType is a valid json schema
  messageAttributes?: SqsMessageAttributesType<Contract>;
};
