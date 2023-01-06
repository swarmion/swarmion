import { ApiGatewayContract } from 'contracts';

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
} as const;

export const requestContextSchema = {
  type: 'object',
  properties: {
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
  required: ['authorizer'],
} as const;

export const httpApiGatewayContractMock = new ApiGatewayContract({
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
