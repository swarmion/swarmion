/* eslint-disable max-lines */
import type {
  APIGatewayEventRequestContextJWTAuthorizer,
  APIGatewayEventRequestContextLambdaAuthorizer,
  APIGatewayEventRequestContextV2WithAuthorizer,
  APIGatewayEventRequestContextWithAuthorizer,
  APIGatewayProxyCognitoAuthorizer,
} from 'aws-lambda';

import { ApiGatewayContract } from '../apiGatewayContract';
import { getLambdaHandler } from '../features';
import { HandlerType } from '../types';

describe('apiGateway lambda handler', () => {
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

  const baseRequestContext: APIGatewayEventRequestContextV2WithAuthorizer<undefined> =
    {
      authorizer: undefined,
      accountId: '',
      apiId: '',
      domainName: '',
      domainPrefix: '',
      http: {
        method: '',
        path: '',
        protocol: '',
        sourceIp: '',
        userAgent: '',
      },
      requestId: '',
      routeKey: '',
      stage: '',
      time: '',
      timeEpoch: 0,
    };

  describe('httpApi, with authorizer, when all parameters are set', () => {
    it('should return a correctly typed handler with cognito authorizer', async () => {
      const httpApiContract = new ApiGatewayContract({
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
      });

      const fakeRequestContext: APIGatewayEventRequestContextV2WithAuthorizer<APIGatewayProxyCognitoAuthorizer> =
        {
          ...baseRequestContext,
          authorizer: { claims: { foo: 'claimBar' } },
        };

      const handler: HandlerType<typeof httpApiContract> = ({
        body,
        pathParameters,
        queryStringParameters,
        headers,
        requestContext,
      }) => {
        const myCustomClaim: string = requestContext.authorizer.claims.foo;

        const name =
          body.foo +
          pathParameters.pageNumber +
          queryStringParameters.testId +
          headers.myHeader +
          myCustomClaim;

        return Promise.resolve({ id: 'hello', name });
      };
      expect(getLambdaHandler(httpApiContract)(handler)).toEqual(handler);

      const { id, name } = await handler({
        pathParameters: { userId: 'toto', pageNumber: '15' },
        body: { foo: 'bar' },
        headers: { myHeader: 'MyCustomHeader', anotherHeader: 'anotherHeader' },
        queryStringParameters: { testId: 'myTestId' },
        requestContext: fakeRequestContext,
      });

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
          ...baseRequestContext,
          authorizer: {
            principalId: '',
            integrationLatency: 0,
            jwt: { claims: { foo: 'claimBar' }, scopes: ['profile'] },
          },
        };

      const handler: HandlerType<typeof httpApiContract> = ({
        body,
        pathParameters,
        queryStringParameters,
        headers,
        requestContext,
      }) => {
        const myCustomClaim = requestContext.authorizer.jwt.claims.foo;

        const name =
          body.foo +
          pathParameters.pageNumber +
          queryStringParameters.testId +
          headers.myHeader +
          myCustomClaim.toString();

        return Promise.resolve({ id: 'hello', name });
      };
      expect(getLambdaHandler(httpApiContract)(handler)).toEqual(handler);

      const { id, name } = await handler({
        pathParameters: { userId: 'toto', pageNumber: '15' },
        body: { foo: 'bar' },
        headers: { myHeader: 'MyCustomHeader', anotherHeader: 'anotherHeader' },
        queryStringParameters: { testId: 'myTestId' },
        requestContext: fakeRequestContext,
      });

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
        ...baseRequestContext,
        authorizer: {
          lambda: { foo: 'claimBar' },
        },
      };

      const handler: HandlerType<typeof httpApiContract> = ({
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

      const { id, name } = await handler({
        pathParameters: { userId: 'toto', pageNumber: '15' },
        body: { foo: 'bar' },
        headers: { myHeader: 'MyCustomHeader', anotherHeader: 'anotherHeader' },
        queryStringParameters: { testId: 'myTestId' },
        requestContext: fakeRequestContext,
      });

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
      authorizerType: undefined,
      pathParametersSchema: undefined,
      queryStringParametersSchema: undefined,
      headersSchema: undefined,
      bodySchema,
      outputSchema: undefined,
    });

    it('should return a correctly typed handler', async () => {
      const handler: HandlerType<typeof restApiContract> = async () => {
        return Promise.resolve(undefined);
      };
      expect(getLambdaHandler(restApiContract)(handler)).toEqual(handler);

      // let's imagine that lambda will send us the following context
      // @ts-expect-error we don't want to generate a full event here
      const fakeRequestContext: APIGatewayEventRequestContextWithAuthorizer<undefined> =
        {};
      expect(
        await handler({
          body: { foo: 'bar' },
          requestContext: fakeRequestContext,
        }),
      ).toBe(undefined);
    });

    it('should not have claims in its request context', async () => {
      const fakeRequestContext: APIGatewayEventRequestContextWithAuthorizer<undefined> =
        {
          accountId: '',
          apiId: '',
          authorizer: undefined,
          protocol: '',
          httpMethod: '',
          identity: {
            accessKey: null,
            accountId: null,
            apiKey: null,
            apiKeyId: null,
            caller: null,
            clientCert: null,
            cognitoAuthenticationProvider: null,
            cognitoAuthenticationType: null,
            cognitoIdentityId: null,
            cognitoIdentityPoolId: null,
            principalOrgId: null,
            sourceIp: 'string',
            user: null,
            userAgent: null,
            userArn: null,
          },
          path: '',
          stage: '',
          requestId: '',
          requestTimeEpoch: 0,
          resourceId: '',
          resourcePath: '',
        };

      const handler: HandlerType<typeof restApiContract> = async ({
        requestContext,
      }) => {
        const undefinedAuthorizer: undefined = requestContext.authorizer;

        return Promise.resolve(undefinedAuthorizer);
      };
      expect(getLambdaHandler(restApiContract)(handler)).toEqual(handler);

      expect(
        await handler({
          body: { foo: 'bar' },
          requestContext: fakeRequestContext,
        }),
      ).toBe(undefined);
    });
  });
});
