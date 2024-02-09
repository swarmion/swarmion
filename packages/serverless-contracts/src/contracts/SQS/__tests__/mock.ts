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

export const baseRecord = {
  messageId: '94187476-d900-4885-9db1-0146dea271df',
  receiptHandle:
    'AQEBIG00N51r0pdueidoj1AYCpxO3iKsIKNsf1wVIrwcdCDfs9UUxP8NUgPMsk8oAjyohJ+IYCYoFo4KOc7xwBhI1VNbBDHwek32JQbxmxGNHiG4U15UQ5pdtx70DTEVbqHPma3vdSvJ+MX3/oD3EcCCcmfSarFNBkDvsxTOJM6mMqVeZyfPnB4haX6y6y9r8i4m3LjqdWpVW4O5u0eKVjaSM8EC9pPf4jpezjxQnQDYl8BiD0ENU3aJORtPKKqOc7Nw0uDCGcZwQHnzCQagrh+fcu16NipNHiCoyEJfvQNrlqw=',
  body: '{}',
  attributes: {
    ApproximateReceiveCount: '1',
    SentTimestamp: '1654255344046',
    SequenceNumber: '18870233441785327616',
    MessageGroupId: 'my-group-id',
    SenderId: 'AIDAY5TJ4WEAN6SB57RST',
    MessageDeduplicationId:
      '887e7257601af74096f169d27fe8d16d9fbc147989e4d9f63c9dc4c533b3dd10',
    ApproximateFirstReceiveTimestamp: '1654255404104',
  },
  messageAttributes: {},
  md5OfBody: '8a34a7d0f20ae875018098c3280e947a',
  eventSource: 'aws:sqs',
  eventSourceARN: 'arn:aws:sqs:eu-west-1:xxxx:my-queue',
  awsRegion: 'eu-west-1',
};
