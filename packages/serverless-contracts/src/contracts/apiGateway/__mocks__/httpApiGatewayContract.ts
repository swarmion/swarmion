import { StatusCodes } from 'types/http';

import { createApiGatewayContract } from '../apiGatewayContract';

export const pathParametersSchema = {
  type: 'object',
  properties: { userId: { type: 'string' }, pageNumber: { type: 'string' } },
  required: ['userId', 'pageNumber'],
  additionalProperties: false,
} as const;

export const queryStringParametersSchema = {
  type: 'object',
  properties: { testId: { type: 'string' } },
  required: ['testId'],
  additionalProperties: false,
} as const;

export const headersSchema = {
  type: 'object',
  properties: { myHeader: { type: 'string' } },
  required: ['myHeader'],
} as const;

export const bodySchema = {
  type: 'object',
  properties: { foo: { type: 'string' } },
  required: ['foo'],
} as const;

export const outputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
  },
  required: ['id', 'name'],
  additionalProperties: false,
} as const;

export const outputSchemas = {
  [StatusCodes.OK]: outputSchema,
};

export const outputSchema2 = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    age: { type: 'number' },
  },
  additionalProperties: false,
  required: ['id', 'age'],
} as const;

export const httpApiGatewayContractMock = createApiGatewayContract({
  id: 'testContract',
  path: '/users/{userId}',
  method: 'GET',
  integrationType: 'httpApi',
  authorizerType: 'cognito',
  pathParametersSchema,
  queryStringParametersSchema,
  headersSchema,
  bodySchema,
  outputSchemas: {
    [StatusCodes.OK]: outputSchema,
    [StatusCodes.BAD_REQUEST]: outputSchema2,
  },
});
