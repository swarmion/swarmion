/* eslint-disable max-lines */
import { z } from 'zod';

import { HttpStatusCodes } from 'types/http';

import { ApiGatewayContract } from '../apiGatewayContract';

describe('apiGateway contracts', () => {
  const pathParametersSchema = z.object({
    userId: z.string(),
    pageNumber: z.string(),
  });

  const queryStringParametersSchema = z.object({
    testId: z.string(),
  });

  const headersSchema = z.object({
    myHeader: z.string(),
  });

  const bodySchema = z.object({
    foo: z.string(),
  });

  const outputSchema = z.object({
    id: z.string(),
    name: z.string(),
  });

  const outputSchemas = {
    [HttpStatusCodes.OK]: outputSchema,
  };

  describe('httpApi, when all parameters are set - outputSchema', () => {
    const httpApiContract = new ApiGatewayContract({
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
      expect(httpApiContract.inputJsonSchema).toMatchObject({
        type: 'object',
        properties: {
          pathParameters: {
            type: 'object',
            properties: {
              userId: {
                type: 'string',
              },
              pageNumber: {
                type: 'string',
              },
            },
            required: ['userId', 'pageNumber'],
            additionalProperties: false,
          },
          queryStringParameters: {
            type: 'object',
            properties: {
              testId: {
                type: 'string',
              },
            },
            required: ['testId'],
            additionalProperties: false,
          },
          headers: {
            type: 'object',
            properties: {
              myHeader: {
                type: 'string',
              },
            },
            required: ['myHeader'],
            additionalProperties: false,
          },
          body: {
            type: 'object',
            properties: {
              foo: {
                type: 'string',
              },
            },
            required: ['foo'],
            additionalProperties: false,
          },
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
        [HttpStatusCodes.OK]: outputSchema,
      });
    });
  });

  describe('httpApi, when all parameters are set - outputSchemas', () => {
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
      outputSchemas: { 201: outputSchema },
    });

    it('should have the correct inputSchema', () => {
      expect(httpApiContract.inputJsonSchema).toMatchObject({
        type: 'object',
        properties: {
          pathParameters: {
            type: 'object',
            properties: {
              userId: {
                type: 'string',
              },
              pageNumber: {
                type: 'string',
              },
            },
            required: ['userId', 'pageNumber'],
            additionalProperties: false,
          },
          queryStringParameters: {
            type: 'object',
            properties: {
              testId: {
                type: 'string',
              },
            },
            required: ['testId'],
            additionalProperties: false,
          },
          headers: {
            type: 'object',
            properties: {
              myHeader: {
                type: 'string',
              },
            },
            required: ['myHeader'],
            additionalProperties: false,
          },
          body: {
            type: 'object',
            properties: {
              foo: {
                type: 'string',
              },
            },
            required: ['foo'],
            additionalProperties: false,
          },
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
    const restApiContract = new ApiGatewayContract({
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
      expect(restApiContract.inputJsonSchema).toMatchObject({
        type: 'object',
        properties: {
          pathParameters: {
            type: 'object',
            properties: {
              userId: {
                type: 'string',
              },
              pageNumber: {
                type: 'string',
              },
            },
            required: ['userId', 'pageNumber'],
            additionalProperties: false,
          },
          queryStringParameters: {
            type: 'object',
            properties: {
              testId: {
                type: 'string',
              },
            },
            required: ['testId'],
            additionalProperties: false,
          },
          headers: {
            type: 'object',
            properties: {
              myHeader: {
                type: 'string',
              },
            },
            required: ['myHeader'],
            additionalProperties: false,
          },
          body: {
            type: 'object',
            properties: {
              foo: {
                type: 'string',
              },
            },
            required: ['foo'],
            additionalProperties: false,
          },
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
      expect(restApiContract.outputSchemas).toEqual({
        [HttpStatusCodes.OK]: outputSchema,
      });
    });
  });

  describe('restAPi, when it is instanciated with a subset of schemas', () => {
    const restApiContract = new ApiGatewayContract({
      id: 'testContractRest',
      path: 'coucou',
      method: 'POST',
      integrationType: 'restApi',
    });
    it('should should have the correct outputSchema', () => {
      expect(restApiContract.outputSchemas).toEqual({
        [HttpStatusCodes.OK]: undefined,
      });
    });

    it('should should have the correct inputSchema', () => {
      expect(restApiContract.inputJsonSchema).toMatchObject({
        type: 'object',
        properties: {},
        additionalProperties: true,
      });
    });
  });
});
