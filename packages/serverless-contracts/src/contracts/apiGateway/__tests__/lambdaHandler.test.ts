import type {
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

  describe('httpApi, with authorizer, when all parameters are set', () => {
    const httpApiContract = new ApiGatewayContract({
      id: 'testContract',
      path: '/users/{userId}',
      method: 'GET',
      integrationType: 'httpApi',
      hasAuthorizer: true,
      pathParametersSchema,
      queryStringParametersSchema,
      headersSchema,
      bodySchema,
      outputSchema,
    });

    it('should return a correctly typed handler', async () => {
      // let's imagine that lambda will send us the following context
      // @ts-expect-error we don't want to generate a full event here
      const fakeRequestContext: APIGatewayEventRequestContextWithAuthorizer<APIGatewayProxyCognitoAuthorizer> =
        { authorizer: { claims: { myClaimFoo: 'myClaimBar' } } };

      const handler: HandlerType<typeof httpApiContract> = ({
        body,
        pathParameters,
        queryStringParameters,
        headers,
        requestContext,
      }) => {
        console.log(
          body,
          pathParameters,
          queryStringParameters,
          headers,
          requestContext.authorizer.claims,
        );

        const myCustomClaim: string =
          requestContext.authorizer.claims.myClaimFoo;

        return Promise.resolve({ id: 'hello', name: myCustomClaim });
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
      expect(name).toBe('myClaimBar');
    });
  });

  describe('restApi, with no authorizer, when it is instantiated with a subset of schemas', () => {
    const restApiContract = new ApiGatewayContract({
      id: 'testContract',
      path: '/hello',
      method: 'POST',
      integrationType: 'restApi',
      hasAuthorizer: false,
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
      // let's imagine that lambda will send us the following context
      // @ts-expect-error we don't want to generate a full event here
      const fakeRequestContext: APIGatewayEventRequestContextWithAuthorizer<undefined> =
        {};

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
