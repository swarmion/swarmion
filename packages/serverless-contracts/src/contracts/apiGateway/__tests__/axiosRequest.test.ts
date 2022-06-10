import axios from 'axios';

import { ApiGatewayContract } from '../apiGatewayContract';
import { getAxiosRequest } from '../features';

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
      method: 'GET',
      integrationType: 'httpApi',
      hasAuthorizer: false,
      pathParametersSchema,
      queryStringParametersSchema,
      headersSchema,
      bodySchema,
      outputSchema,
    });

    it('should have the correct axiosRequest', async () => {
      await expect(() =>
        getAxiosRequest(httpApiContract, axios.create({ baseURL: 'test' }), {
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
        }),
      ).rejects.toMatchObject({
        config: {
          url: '/users/azer',
          data: '{"foo":"tyui","bar":["yuio"]}',
          params: { testId: 'erty' },
        },
      });
    });
  });

  describe('httpApi, when it is instanciated with a subset of schemas', () => {
    const restApiContract = new ApiGatewayContract({
      id: 'testContract',
      path: '/coucou',
      method: 'POST',
      integrationType: 'httpApi',
      hasAuthorizer: false,
      pathParametersSchema: undefined,
      queryStringParametersSchema: undefined,
      headersSchema: undefined,
      bodySchema: undefined,
      outputSchema: undefined,
    });

    it('should have the correct axios request ', async () => {
      await expect(() =>
        getAxiosRequest(restApiContract, axios.create({ baseURL: 'test' }), {}),
      ).rejects.toMatchObject({
        config: {
          url: '/coucou',
        },
      });
    });
  });
});
