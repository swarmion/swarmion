import { JSONSchema } from 'json-schema-to-ts';

import { SQSContract } from '../sqsContract';

export const messageBodySchema = {
  type: 'object',
  properties: {
    toto: { type: 'string' },
  },
  required: ['toto'],
  additionalProperties: false,
} as const satisfies JSONSchema;

export const messageAttributesSchema = {
  type: 'object',
  properties: {
    tata: { type: 'string' },
  },
  additionalProperties: false,
} as const satisfies JSONSchema;

export const sqsContract = new SQSContract({
  id: 'myAwesomeSQSContract',
  messageBodySchema,
  messageAttributesSchema,
});

export const minimalSqsContract = new SQSContract({
  id: 'myAwesomeMinimalSQSContract',
  messageBodySchema: {
    type: 'string',
  },
});
