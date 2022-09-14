/// <reference lib="dom" />

import { ApiGatewayContract } from '../apiGatewayContract';
import { getFetchRequest } from '../features/fetchRequest';

const mockedFetch = vi.fn(() =>
  Promise.resolve({
    json: () => {
      return Promise.resolve(undefined);
    },
  }),
);

describe('apiGateway fetch request', () => {
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
    properties: {
      foo: { type: 'string' },
      bar: { type: 'array', items: { type: 'string' } },
    },
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

  describe('restApi, when all parameters are set', () => {
    const httpApiContract = new ApiGatewayContract({
      id: 'testContract',
      path: '/users/{userId}',
      method: 'POST',
      integrationType: 'httpApi',
      authorizerType: undefined,
      pathParametersSchema,
      queryStringParametersSchema,
      headersSchema,
      bodySchema,
      outputSchema,
    });

    it('should have the correct axiosRequest', async () => {
      await getFetchRequest(
        httpApiContract,
        mockedFetch as unknown as typeof fetch,
        {
          pathParameters: {
            userId: 'azer',
            pageNumber: 'zert',
          },
          queryStringParameters: {
            testId: 'erty',
          },
          headers: {
            myHeader: 'rtyu',
          },
          body: {
            foo: 'tyui',
            bar: ['yuio'],
          },
          baseUrl: 'http://localhost:3000',
        },
      );
      expect(mockedFetch).toHaveBeenCalledWith(
        new URL('http://localhost:3000/users/azer?testId=erty'),
        {
          body: '{"foo":"tyui","bar":["yuio"]}',
          headers: { myHeader: 'rtyu' },
          method: 'POST',
        },
      );
    });
  });

  describe('httpApi, when it is instanciated with a subset of schemas', () => {
    const restApiContract = new ApiGatewayContract({
      id: 'testContract',
      path: '/coucou',
      method: 'GET',
      integrationType: 'httpApi',
      authorizerType: undefined,
      pathParametersSchema: undefined,
      queryStringParametersSchema: undefined,
      headersSchema: undefined,
      bodySchema: undefined,
      outputSchema: undefined,
    });

    it('should have the correct axios request ', async () => {
      await getFetchRequest(
        restApiContract,
        mockedFetch as unknown as typeof fetch,
        { baseUrl: 'http://localhost:3000' },
      );
      expect(mockedFetch).toHaveBeenCalledWith(
        new URL('http://localhost:3000/coucou'),
        {
          body: undefined,
          headers: undefined,
          method: 'GET',
        },
      );
    });
  });

  describe('httpApi without base url', () => {
    const httpApiContract = new ApiGatewayContract({
      id: 'testContract',
      path: '/coucou',
      method: 'GET',
      integrationType: 'httpApi',
      authorizerType: undefined,
      pathParametersSchema: undefined,
      queryStringParametersSchema,
      headersSchema: undefined,
      bodySchema: undefined,
      outputSchema: undefined,
    });

    it('should have the correct axios request ', async () => {
      await getFetchRequest(
        httpApiContract,
        mockedFetch as unknown as typeof fetch,
        {
          queryStringParameters: {
            testId: 'erty',
          },
        },
      );
      expect(mockedFetch).toHaveBeenCalledWith('/coucou?testId=erty', {
        body: undefined,
        headers: undefined,
        method: 'GET',
      });
    });
  });
});
