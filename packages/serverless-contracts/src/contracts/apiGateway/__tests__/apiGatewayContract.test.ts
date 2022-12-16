import { StatusCodes } from 'types/http';

import {
  createApiGatewayContract,
  getInputSchema,
} from '../apiGatewayContract';

describe('apiGateway contracts', () => {
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

  describe('httpApi, when all parameters are set - outputSchema', () => {
    const httpApiContract = createApiGatewayContract({
      id: 'testContract',
      path: '/users/{userId}',
      method: 'GET',
      integrationType: 'httpApi',
      pathParametersSchema,
      queryStringParametersSchema,
      headersSchema,
      bodySchema,
      outputSchemas,
    });

    it('should have the correct inputSchema', () => {
      expect(getInputSchema(httpApiContract)).toEqual({
        type: 'object',
        properties: {
          pathParameters: pathParametersSchema,
          queryStringParameters: queryStringParametersSchema,
          headers: headersSchema,
          body: bodySchema,
        },
        required: [
          'pathParameters',
          'queryStringParameters',
          'headers',
          'body',
        ],
        additionalProperties: true,
      });
    });

    it('should have the correct outputSchemas', () => {
      expect(httpApiContract.outputSchemas).toEqual({
        [StatusCodes.OK]: outputSchema,
      });
    });
  });

  describe('httpApi, when all parameters are set - outputSchemas', () => {
    const httpApiContract = createApiGatewayContract({
      id: 'testContract',
      path: '/users/{userId}',
      method: 'GET',
      integrationType: 'httpApi',
      pathParametersSchema,
      queryStringParametersSchema,
      headersSchema,
      bodySchema,
      outputSchemas: { 201: outputSchema },
    });

    it('should have the correct inputSchema', () => {
      expect(getInputSchema(httpApiContract)).toEqual({
        type: 'object',
        properties: {
          pathParameters: pathParametersSchema,
          queryStringParameters: queryStringParametersSchema,
          headers: headersSchema,
          body: bodySchema,
        },
        required: [
          'pathParameters',
          'queryStringParameters',
          'headers',
          'body',
        ],
        additionalProperties: true,
      });
    });

    it('should have the correct outputSchemas', () => {
      expect(httpApiContract.outputSchemas).toEqual({ ['201']: outputSchema });
    });
  });

  describe('restApi, when all parameters are set', () => {
    const restApiContract = createApiGatewayContract({
      id: 'testContract',
      path: '/users/{userId}',
      method: 'GET',
      integrationType: 'restApi',
      pathParametersSchema,
      queryStringParametersSchema,
      headersSchema,
      bodySchema,
      outputSchemas,
    });

    it('should have the correct inputSchema', () => {
      expect(getInputSchema(restApiContract)).toEqual({
        type: 'object',
        properties: {
          pathParameters: pathParametersSchema,
          queryStringParameters: queryStringParametersSchema,
          headers: headersSchema,
          body: bodySchema,
        },
        required: [
          'pathParameters',
          'queryStringParameters',
          'headers',
          'body',
        ],
        additionalProperties: true,
      });
    });
  });

  describe('restAPi, when it is instanciated with a subset of schemas', () => {
    const restApiContract = createApiGatewayContract({
      id: 'testContractRest',
      path: 'coucou',
      method: 'POST',
      integrationType: 'restApi',
    });

    it('should should have the correct inputSchema', () => {
      expect(getInputSchema(restApiContract)).toEqual({
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: true,
      });
    });
  });
});
