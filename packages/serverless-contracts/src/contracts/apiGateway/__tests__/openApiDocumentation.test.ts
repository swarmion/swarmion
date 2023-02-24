import { JSONSchema } from 'json-schema-to-ts';

import { HttpStatusCodes } from 'types/http';

import { ApiGatewayContract } from '../apiGatewayContract';
import { getContractDocumentation } from '../features';

describe('apiGateway openApi contract documentation', () => {
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

  const unauthorizedSchema = {
    type: 'object',
    properties: { message: { type: 'string' } },
    required: ['message'],
  } as const satisfies JSONSchema;

  const outputSchemas = {
    [HttpStatusCodes.OK]: outputSchema,
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
      bodySchema,
      outputSchemas,
    });

    it('should generate open api documentation', () => {
      expect(getContractDocumentation(httpApiContract)).toEqual({
        path: '/users/{userId}',
        method: 'get',
        documentation: {
          parameters: [
            {
              in: 'query',
              name: 'testId',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              in: 'path',
              name: 'userId',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              in: 'path',
              name: 'pageNumber',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    foo: {
                      type: 'string',
                    },
                  },
                  required: ['foo'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Response: 200',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                      },
                      name: {
                        type: 'string',
                      },
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
                    properties: {
                      message: {
                        type: 'string',
                      },
                    },
                    required: ['message'],
                  },
                },
              },
            },
          },
        },
      });
    });
  });

  describe('restApi, when it is instanciated with a subset of schemas', () => {
    const restApiContract = new ApiGatewayContract({
      id: 'testContract',
      path: 'coucou',
      method: 'POST',
      integrationType: 'restApi',
    });

    it('should generate open api documentation', () => {
      expect(getContractDocumentation(restApiContract)).toEqual({
        path: 'coucou',
        method: 'post',
        documentation: {
          responses: {}, // no response is configured
        },
      });
    });
  });
});
