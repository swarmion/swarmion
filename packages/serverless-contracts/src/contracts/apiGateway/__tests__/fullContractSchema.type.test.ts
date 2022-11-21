import { JSONSchema } from 'json-schema-to-ts';

import { FullContractSchemaType } from '../types';

const pathParametersSchema = {
  type: 'object',
  properties: { userId: { type: 'string' }, pageNumber: { type: 'string' } },
  required: ['userId', 'pageNumber'],
  additionalProperties: false,
} as const;

const queryStringParametersSchema = {
  type: 'object',
  properties: { testId: { type: 'string' } },
  required: ['testId'],
  additionalProperties: false,
} as const;

const headersSchema = {
  type: 'object',
  properties: { myHeader: { type: 'string' } },
  required: ['myHeader'],
} as const;

const bodySchema = {
  type: 'object',
  properties: { foo: { type: 'string' } },
  required: ['foo'],
} as const;

const outputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
  },
  required: ['id', 'name'],
} as const;

type Check = FullContractSchemaType<
  'path',
  'POST',
  'restApi',
  typeof pathParametersSchema,
  typeof queryStringParametersSchema,
  typeof headersSchema,
  typeof bodySchema,
  typeof outputSchema
> extends JSONSchema
  ? 'pass'
  : 'fail';

const check: Check = 'pass';
check;
