/* eslint-disable max-lines */
import type {
  APIGatewayEventRequestContextJWTAuthorizer,
  APIGatewayEventRequestContextLambdaAuthorizer,
  APIGatewayEventRequestContextV2WithAuthorizer,
  APIGatewayEventRequestContextWithAuthorizer,
} from 'aws-lambda';

import {
  getAPIGatewayEventRequestContextMock,
  getAPIGatewayV2EventRequestContextMock,
} from '@swarmion/serverless-helpers';

import { getHandlerContextMock } from '__mocks__/requestContext';

import {
  bodySchema,
  headersSchema,
  httpApiGatewayContractMock,
  outputSchema,
  pathParametersSchema,
  queryStringParametersSchema,
} from '../__mocks__/httpApiGatewayContract';
import { ApiGatewayContract } from '../apiGatewayContract';
import { getLambdaHandler } from '../features';
import { SwarmionApiGatewayEvent, SwarmionApiGatewayHandler } from '../types';

describe('apiGateway lambda handler', () => {
  describe('httpApi, with authorizer, when all parameters are set', () => {
    it('should return a correctly typed handler with cognito authorizer', async () => {
      const httpApiContract = httpApiGatewayContractMock;

      const fakeRequestContext = {
        ...getAPIGatewayV2EventRequestContextMock(),
        accountId: '123456789012' as const,
        authorizer: { claims: { foo: 'claimBar' } },
      };

      const handler: SwarmionApiGatewayHandler<typeof httpApiContract> = ({
        body,
        pathParameters,
        queryStringParameters,
        headers,
        requestContext,
      }) => {
        console.log(requestContext);

        const myCustomClaim = requestContext.authorizer.claims.foo;

        const name =
          body.foo +
          pathParameters.pageNumber +
          queryStringParameters.testId +
          headers.myHeader +
          myCustomClaim;

        return Promise.resolve({ id: 'hello', name });
      };
      expect(getLambdaHandler(httpApiContract)(handler)).toEqual(handler);
      const fakeContext = getHandlerContextMock();

      const { id, name } = await handler(
        {
          pathParameters: { userId: 'toto', pageNumber: '15' },
          body: { foo: 'bar' },
          headers: {
            myHeader: 'MyCustomHeader',
            anotherHeader: 'anotherHeader',
          },
          queryStringParameters: { testId: 'myTestId' },
          requestContext: fakeRequestContext,
        },
        fakeContext,
      );

      expect(id).toBe('hello');
      expect(name).toBe('bar15myTestIdMyCustomHeaderclaimBar');
    });

    it('should return a correctly typed handler with jwt authorizer', async () => {
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

      const fakeRequestContext: APIGatewayEventRequestContextV2WithAuthorizer<APIGatewayEventRequestContextJWTAuthorizer> =
        {
          ...getAPIGatewayV2EventRequestContextMock(),
          authorizer: {
            principalId: '',
            integrationLatency: 0,
            jwt: { claims: { foo: 'claimBar' }, scopes: ['profile'] },
          },
        };
      const fakeContext = getHandlerContextMock();

      const handler: SwarmionApiGatewayHandler<typeof httpApiContract> = ({
        body,
        pathParameters,
        queryStringParameters,
        headers,
        requestContext,
      }) => {
        const myCustomClaim = requestContext.authorizer.jwt.claims.foo ?? '';

        const name =
          body.foo +
          pathParameters.pageNumber +
          queryStringParameters.testId +
          headers.myHeader +
          myCustomClaim.toString();

        return Promise.resolve({ id: 'hello', name });
      };
      expect(getLambdaHandler(httpApiContract)(handler)).toEqual(handler);

      const { id, name } = await handler(
        {
          pathParameters: { userId: 'toto', pageNumber: '15' },
          body: { foo: 'bar' },
          headers: {
            myHeader: 'MyCustomHeader',
            anotherHeader: 'anotherHeader',
          },
          queryStringParameters: { testId: 'myTestId' },
          requestContext: fakeRequestContext,
        },
        fakeContext,
      );

      expect(id).toBe('hello');
      expect(name).toBe('bar15myTestIdMyCustomHeaderclaimBar');
    });

    it('should return a correctly typed handler with jwt authorizer', async () => {
      const httpApiContract = new ApiGatewayContract({
        id: 'testContract',
        path: '/users/{userId}',
        method: 'GET',
        integrationType: 'httpApi',
        authorizerType: 'lambda',
        pathParametersSchema,
        queryStringParametersSchema,
        headersSchema,
        bodySchema,
        outputSchema,
      });

      interface LambdaType {
        foo: string;
      }

      const fakeRequestContext: APIGatewayEventRequestContextV2WithAuthorizer<
        APIGatewayEventRequestContextLambdaAuthorizer<LambdaType>
      > = {
        ...getAPIGatewayV2EventRequestContextMock(),
        authorizer: {
          lambda: { foo: 'claimBar' },
        },
      };
      const fakeContext = getHandlerContextMock();

      const handler: SwarmionApiGatewayHandler<typeof httpApiContract> = ({
        body,
        pathParameters,
        queryStringParameters,
        headers,
        requestContext,
      }) => {
        const myCustomClaim = (requestContext.authorizer.lambda as LambdaType)
          .foo;

        const name =
          body.foo +
          pathParameters.pageNumber +
          queryStringParameters.testId +
          headers.myHeader +
          myCustomClaim;

        return Promise.resolve({ id: 'hello', name });
      };
      expect(getLambdaHandler(httpApiContract)(handler)).toEqual(handler);

      const event: SwarmionApiGatewayEvent<typeof httpApiContract> = {
        pathParameters: { userId: 'toto', pageNumber: '15' },
        body: { foo: 'bar' },
        headers: {
          myHeader: 'MyCustomHeader',
          anotherHeader: 'anotherHeader',
        },
        queryStringParameters: { testId: 'myTestId' },
        requestContext: fakeRequestContext,
      };

      const { id, name } = await handler(event, fakeContext);

      expect(id).toBe('hello');
      expect(name).toBe('bar15myTestIdMyCustomHeaderclaimBar');
    });
  });

  describe('restApi, with no authorizer, when it is instantiated with a subset of schemas', () => {
    const restApiContract = new ApiGatewayContract({
      id: 'testContract',
      path: '/hello',
      method: 'POST',
      integrationType: 'restApi',
      bodySchema,
    });

    it('should return a correctly typed handler', async () => {
      const handler: SwarmionApiGatewayHandler<
        typeof restApiContract
      > = async () => {
        return Promise.resolve(undefined);
      };
      expect(getLambdaHandler(restApiContract)(handler)).toEqual(handler);

      // let's imagine that lambda will send us the following context
      // @ts-expect-error we don't want to generate a full event here
      const fakeRequestContext: APIGatewayEventRequestContextWithAuthorizer<undefined> =
        {};
      const fakeContext = getHandlerContextMock();

      expect(
        await handler(
          {
            body: { foo: 'bar' },
            requestContext: fakeRequestContext,
          },
          fakeContext,
        ),
      ).toBe(undefined);
    });

    it('should not have claims in its request context', async () => {
      const handler: SwarmionApiGatewayHandler<
        typeof restApiContract
      > = async ({ requestContext }) => {
        const undefinedAuthorizer: undefined = requestContext.authorizer;

        return Promise.resolve(undefinedAuthorizer);
      };
      expect(getLambdaHandler(restApiContract)(handler)).toEqual(handler);
      const fakeContext = getHandlerContextMock();

      expect(
        await handler(
          {
            body: { foo: 'bar' },
            requestContext: getAPIGatewayEventRequestContextMock(),
          },
          fakeContext,
        ),
      ).toBe(undefined);
    });
  });
});
