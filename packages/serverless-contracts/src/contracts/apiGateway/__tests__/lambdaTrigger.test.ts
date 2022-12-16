import { getTrigger } from 'features/lambdaTrigger';
import { StatusCodes } from 'types/http';
import { LambdaFunction } from 'types/lambdaEvents';

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

  const outputSchemas = {
    [StatusCodes.OK]: outputSchema,
  };

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
        outputSchemas,
      });

      const trigger = getTrigger(httpApiContract);
      const lambdaConfig: LambdaFunction = {
        events: [trigger],
      };

      expect(lambdaConfig).toEqual({
        events: [
          {
            httpApi: {
              path: '/users/{userId}',
              method: 'GET',
            },
          },
        ],
      });

      // @ts-expect-error it should not be possible to pass an authorizer
      getTrigger(httpApiContract, { authorizer: '123' });
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
        outputSchemas,
      });
      const trigger = getTrigger(httpApiContract, { authorizer: '123' });
      const lambdaConfig: LambdaFunction = {
        events: [trigger],
      };
      expect(lambdaConfig).toEqual({
        events: [
          {
            httpApi: {
              path: '/users/{userId}',
              method: 'GET',
              authorizer: '123',
            },
          },
        ],
      });

      // @ts-expect-error the second parameter should be required since there is an authorizer to define
      getTrigger(httpApiContract);
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
        outputSchemas,
      });

      const trigger = getTrigger(restApiContract);
      const lambdaConfig: LambdaFunction = {
        events: [trigger],
      };
      expect(lambdaConfig).toEqual({
        events: [
          {
            http: {
              path: '/users/{userId}',
              method: 'GET',
            },
          },
        ],
      });
      expect(getTrigger(restApiContract)).toEqual({
        http: {
          path: '/users/{userId}',
          method: 'GET',
        },
      });

      // @ts-expect-error it should not be possible to pass an authorizer
      getTrigger(restApiContract, { authorizer: '123' });
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
        outputSchemas,
      });
      expect(getTrigger(restApiContract, { authorizer: '123' })).toEqual({
        http: {
          path: '/users/{userId}',
          method: 'GET',
          authorizer: '123',
        },
      });

      // @ts-expect-error the second parameter should be required since there is an authorizer to define
      getTrigger(restApiContract);
    });
  });
});
