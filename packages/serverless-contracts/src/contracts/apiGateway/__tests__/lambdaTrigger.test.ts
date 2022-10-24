import { getTrigger } from 'features/lambdaTrigger';

import { ApiGatewayContract } from '../apiGatewayContract';

describe('apiGateway lambda trigger', () => {
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

  describe('httpApi trigger', () => {
    it('should have the correct trigger without authorizer', () => {
      const httpApiContract = new ApiGatewayContract({
        id: 'testContract',
        path: '/users/{userId}',
        method: 'GET',
        integrationType: 'httpApi',
        authorizerType: undefined,
        pathParametersSchema,
        queryStringParametersSchema,
        headersSchema,
        bodySchema,
        outputSchema,
      });
      expect(getTrigger(httpApiContract)).toEqual({
        httpApi: {
          path: '/users/{userId}',
          method: 'GET',
        },
      });
    });

    it('should have the correct complete trigger with authorizer', () => {
      const httpApiContract = new ApiGatewayContract({
        id: 'testContract',
        path: '/users/{userId}',
        method: 'GET',
        integrationType: 'httpApi',
        authorizerType: 'jwt',
        pathParametersSchema,
        queryStringParametersSchema,
        headersSchema,
        bodySchema,
        outputSchema,
      });
      expect(getTrigger(httpApiContract, { authorizer: '123' })).toEqual({
        httpApi: {
          path: '/users/{userId}',
          method: 'GET',
          authorizer: '123',
        },
      });
    });
  });

  describe('restApi trigger', () => {
    it('should have the correct trigger without authorizer', () => {
      const restApiContract = new ApiGatewayContract({
        id: 'testContract',
        path: '/users/{userId}',
        method: 'GET',
        integrationType: 'restApi',
        authorizerType: undefined,
        pathParametersSchema,
        queryStringParametersSchema,
        headersSchema,
        bodySchema,
        outputSchema,
      });
      expect(getTrigger(restApiContract)).toEqual({
        http: {
          path: '/users/{userId}',
          method: 'GET',
        },
      });
    });

    it('should have the correct complete trigger with authorizer', () => {
      const restApiContract = new ApiGatewayContract({
        id: 'testContract',
        path: '/users/{userId}',
        method: 'GET',
        integrationType: 'restApi',
        authorizerType: 'jwt',
        pathParametersSchema,
        queryStringParametersSchema,
        headersSchema,
        bodySchema,
        outputSchema,
      });
      expect(getTrigger(restApiContract, { authorizer: '123' })).toEqual({
        http: {
          path: '/users/{userId}',
          method: 'GET',
          authorizer: '123',
        },
      });
    });
  });
});
