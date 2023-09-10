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
