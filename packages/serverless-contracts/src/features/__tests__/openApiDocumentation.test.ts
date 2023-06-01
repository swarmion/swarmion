/* eslint-disable max-lines */
import { JSONSchema } from 'json-schema-to-ts';

import { ApiGatewayContract } from 'contracts';
import { HttpStatusCodes } from 'types/http';

import { getOpenApiDocumentation } from '..';

describe('openApi service documentation', () => {
  const pathParametersSchema = {
    type: 'object',
    properties: { userId: { type: 'string' } },
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
    properties: { foo: { type: ['string', 'null'] } },
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

  const unauthorizedSchema = {
    type: 'object',
    properties: { message: { type: 'string' } },
    required: ['message'],
  } as const satisfies JSONSchema;

  const outputSchemas = {
    [HttpStatusCodes.OK]: outputSchema,
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedSchema,
  };

  const outputSchemas2 = {
    [HttpStatusCodes.OK]: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
      required: ['message'],
    } as const,
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedSchema,
  };

  describe('hhtpApi, when all parameters are set', () => {
    const httpApiContract = new ApiGatewayContract({
      id: 'testContract',
      path: '/users/{userId}',
      method: 'GET',
      integrationType: 'httpApi',
      pathParametersSchema,
      queryStringParametersSchema,
      headersSchema,
      outputSchemas,
    });

    const httpApiContract2 = new ApiGatewayContract({
      id: 'testContract',
      path: '/users/{userId}',
      method: 'DELETE',
      integrationType: 'httpApi',
      pathParametersSchema,
      headersSchema,
      outputSchemas,
    });

    const httpApiContract3 = new ApiGatewayContract({
      id: 'testContract2',
      path: '/users',
      method: 'POST',
      integrationType: 'httpApi',
      bodySchema,
      outputSchemas: outputSchemas2,
    });

    it('should generate open api documentation', () => {
      expect(
        getOpenApiDocumentation({
          title: 'Test API',
          description: 'Test API description',
          contracts: [httpApiContract, httpApiContract2, httpApiContract3],
        }),
      ).toMatchObject({
        openapi: '3.0.1',
        info: {
          title: 'Test API',
          description: 'Test API description',
        },
        paths: {
          '/users/{userId}': {
            get: {
              responses: {
                '200': {
                  description: 'Response: 200',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          name: { type: 'string' },
                        },
                        required: ['id', 'name'],
                      },
                    },
                  },
                },
                '401': {
                  description: 'Response: 401',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: { message: { type: 'string' } },
                        required: ['message'],
                      },
                    },
                  },
                },
              },
            },
            delete: {
              responses: {
                '200': {
                  description: 'Response: 200',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          name: { type: 'string' },
                        },
                        required: ['id', 'name'],
                      },
                    },
                  },
                },
                '401': {
                  description: 'Response: 401',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: { message: { type: 'string' } },
                        required: ['message'],
                      },
                    },
                  },
                },
              },
              parameters: [
                {
                  name: 'userId',
                  in: 'path',
                  schema: { type: 'string' },
                  required: true,
                },
              ],
            },
          },
          '/users': {
            post: {
              responses: {
                '200': {
                  description: 'Response: 200',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: { message: { type: 'string' } },
                        required: ['message'],
                      },
                    },
                  },
                },
                '401': {
                  description: 'Response: 401',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: { message: { type: 'string' } },
                        required: ['message'],
                      },
                    },
                  },
                },
              },
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: { foo: { type: 'string', nullable: true } },
                      required: ['foo'],
                    },
                  },
                },
              },
            },
          },
        },
      });
    });
  });
});
