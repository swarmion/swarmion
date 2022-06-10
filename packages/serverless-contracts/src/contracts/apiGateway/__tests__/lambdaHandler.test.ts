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

  describe('hhtpApi, when all parameters are set', () => {
    const httpApiContract = new ApiGatewayContract({
      id: 'testContract',
      path: '/users/{userId}',
      method: 'GET',
      integrationType: 'httpApi',
      hasAuthorizer: false,
      pathParametersSchema,
      queryStringParametersSchema,
      headersSchema,
      bodySchema,
      outputSchema,
    });

    const handler: HandlerType<typeof httpApiContract> = ({
      body,
      pathParameters,
      queryStringParameters,
      headers,
    }) => {
      console.log(body, pathParameters, queryStringParameters, headers);

      return Promise.resolve({ id: 'hello', name: 'world' });
    };

    it('should have the correct handler', () => {
      expect(getLambdaHandler(httpApiContract)(handler)).toEqual(handler);
    });
  });

  describe('restApi, when it is instanciated with a subset of schemas', () => {
    const restApiContract = new ApiGatewayContract({
      id: 'testContract',
      path: '/coucou',
      method: 'POST',
      integrationType: 'restApi',
      hasAuthorizer: false,
      pathParametersSchema: undefined,
      queryStringParametersSchema: undefined,
      headersSchema: undefined,
      bodySchema: undefined,
      outputSchema: undefined,
    });

    const handler: HandlerType<typeof restApiContract> = () => {
      return Promise.resolve(undefined);
    };

    it('should have the correct handler', () => {
      expect(getLambdaHandler(restApiContract)(handler)).toEqual(handler);
    });
  });
});
