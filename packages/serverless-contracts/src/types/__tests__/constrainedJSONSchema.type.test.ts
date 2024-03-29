import { JSONSchema } from 'json-schema-to-ts';
import { A } from 'ts-toolbelt';

import { typeAssert } from 'utils';

import { ConstrainedJSONSchema } from '../constrainedJSONSchema';

type ExtendJsonSchemaCheck = A.Extends<ConstrainedJSONSchema, JSONSchema>;

const extendJsonSchemaCheck: ExtendJsonSchemaCheck = 1;
extendJsonSchemaCheck;

const simpleSchema = {
  type: 'object',
  properties: { userId: { type: 'string' }, pageNumber: { type: 'string' } },
  required: ['userId', 'pageNumber'],
  additionalProperties: false,
} as const;

typeAssert<A.Extends<typeof simpleSchema, ConstrainedJSONSchema>>();

const composedSchema = {
  type: 'object',
  oneof: [
    {
      type: 'object',
      properties: {
        foo: { type: 'string' },
      },
      required: ['foo'],
    },
    {
      type: 'object',
      properties: {
        bar: { type: 'string' },
      },
      required: ['bar'],
      additonalProperties: false,
    },
  ],
} as const;

typeAssert<A.Extends<typeof composedSchema, ConstrainedJSONSchema>>();
