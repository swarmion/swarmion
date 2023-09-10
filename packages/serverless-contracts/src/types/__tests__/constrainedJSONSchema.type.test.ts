import { JSONSchema } from 'json-schema-to-ts';
import { A, Boolean } from 'ts-toolbelt';

import { typeAssert } from 'utils';

import {
  StringDictionaryJSONSchema,
  StringOrNumberDictionaryJSONSchema,
} from '../constrainedJSONSchema';

type ExtendJsonSchemaCheck = A.Extends<StringDictionaryJSONSchema, JSONSchema>;

const extendJsonSchemaCheck: ExtendJsonSchemaCheck = 1;
extendJsonSchemaCheck;

const simpleSchema = {
  type: 'object',
  properties: { userId: { type: 'string' }, pageNumber: { type: 'string' } },
  required: ['userId', 'pageNumber'],
  additionalProperties: false,
} as const;

typeAssert<A.Extends<typeof simpleSchema, StringDictionaryJSONSchema>>();
typeAssert<
  A.Extends<typeof simpleSchema, StringOrNumberDictionaryJSONSchema>
>();

const composedSchema = {
  type: 'object',
  oneOf: [
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

typeAssert<A.Extends<typeof composedSchema, StringDictionaryJSONSchema>>();
typeAssert<
  A.Extends<typeof composedSchema, StringOrNumberDictionaryJSONSchema>
>();

const numberDictSchema = {
  type: 'object',
  properties: { userId: { type: 'number' }, pageNumber: { type: 'number' } },
  required: ['userId', 'pageNumber'],
  additionalProperties: false,
} as const;

typeAssert<
  Boolean.Not<A.Extends<typeof numberDictSchema, StringDictionaryJSONSchema>>
>();
typeAssert<
  A.Extends<typeof numberDictSchema, StringOrNumberDictionaryJSONSchema>
>();

const composedNumberAndStringDictSchema = {
  type: 'object',
  oneOf: [
    {
      type: 'object',
      properties: {
        foo: { type: 'number' },
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

typeAssert<
  Boolean.Not<
    A.Extends<
      typeof composedNumberAndStringDictSchema,
      StringDictionaryJSONSchema
    >
  >
>();
typeAssert<
  A.Extends<
    typeof composedNumberAndStringDictSchema,
    StringOrNumberDictionaryJSONSchema
  >
>();
