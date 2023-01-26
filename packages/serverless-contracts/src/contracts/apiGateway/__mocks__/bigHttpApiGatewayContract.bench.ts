import { JSONSchema } from 'json-schema-to-ts';

import { ApiGatewayContract } from 'contracts';

// object with 100 properties to test the performance
const bigObject: Record<string, JSONSchema> = {};
for (let i = 0; i < 100; i++) {
  bigObject[`prop${i}`] = { type: 'string' };
}

export const pathParametersSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    pageNumber: { type: 'string' },
    ...bigObject,
  },
  required: ['userId', 'pageNumber'],
  additionalProperties: false,
} as const;

export const queryStringParametersSchema = {
  type: 'object',
  properties: { testId: { type: 'string' }, ...bigObject },
  required: ['testId'],
  additionalProperties: false,
} as const;

export const headersSchema = {
  type: 'object',
  properties: { myHeader: { type: 'string' }, ...bigObject },
  required: ['myHeader'],
} as const;

export const bodySchema = {
  type: 'object',
  properties: { foo: { type: 'string' }, ...bigObject },
  required: ['foo'],
} as const;

export const outputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    ...bigObject,
  },
  required: ['id', 'name'],
} as const;

export const requestContextSchema = {
  type: 'object',
  properties: {
    accountId: { const: '123456789012' },
    authorizer: {
      type: 'object',
      properties: {
        claims: {
          type: 'object',
          properties: {
            foo: { type: 'string' },
          },
          required: ['foo'],
        },
      },
      required: ['claims'],
    },
  },
  required: ['accountId', 'authorizer'],
} as const;

export const bigHttpApiContract = new ApiGatewayContract({
  id: 'testContract',
  path: '/users/{userId}',
  method: 'GET',
  integrationType: 'httpApi',
  authorizerType: 'cognito',
  pathParametersSchema,
  queryStringParametersSchema,
  headersSchema,
  bodySchema,
  outputSchema,
  requestContextSchema,
});
