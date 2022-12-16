/* eslint-disable max-lines */
/// <reference lib="dom" />

import { StatusCodes } from 'types/http';

import { createApiGatewayContract } from '../apiGatewayContract';
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
    properties: {
      testId: { type: 'string' },
      optionalParam: { type: 'string' },
    },
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
    const httpApiContract = createApiGatewayContract({
      id: 'testContract',
      path: '/users/{userId}',
      method: 'POST',
      integrationType: 'httpApi',
      pathParametersSchema,
      queryStringParametersSchema,
      headersSchema,
      bodySchema,
      outputSchemas: {
        [StatusCodes.OK]: outputSchema,
      },
    });

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should have the correct axiosRequest when all values are defined', async () => {
      await getFetchRequest(
        httpApiContract,
        mockedFetch as unknown as typeof fetch,
        {
          pathParameters: {
            userId: 'azer',
            pageNumber: 'zert',
          },
          queryStringParameters: {
            testId: 'er',
            optionalParam: 'ty',
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
        new URL('http://localhost:3000/users/azer?testId=er&optionalParam=ty'),
        {
          body: '{"foo":"tyui","bar":["yuio"]}',
          headers: { myHeader: 'rtyu', 'Content-Type': 'application/json' },
          method: 'POST',
        },
      );
    });

    it('should have the correct axiosRequest when some queryStringParameters are undefined', async () => {
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
            optionalParam: undefined,
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
          headers: { myHeader: 'rtyu', 'Content-Type': 'application/json' },
          method: 'POST',
        },
      );
    });
  });

  describe('httpApi, when it is instanciated with a subset of schemas', () => {
    const restApiContract = createApiGatewayContract({
      id: 'testContract',
      path: '/coucou',
      method: 'GET',
      integrationType: 'httpApi',
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
          headers: { 'Content-Type': 'application/json' },
          method: 'GET',
        },
      );
    });
  });

  describe('httpApi without base url', () => {
    const httpApiContract = createApiGatewayContract({
      id: 'testContract',
      path: '/coucou',
      method: 'GET',
      integrationType: 'httpApi',
      queryStringParametersSchema,
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
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      });
    });
  });
});
