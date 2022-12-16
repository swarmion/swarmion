import { StatusCodes } from 'types/http';

import { createApiGatewayContract } from '../apiGatewayContract';
import { getFullContractSchema } from '../features';

describe('apiGateway full contract schema', () => {
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

  describe('htttpApi, when all parameters are set', () => {
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

    it('should have the correct fullContractSchema', () => {
      expect(getFullContractSchema(httpApiContract)).toEqual({
        type: 'object',
        properties: {
          contractId: { const: 'testContract' },
          contractType: { const: 'httpApi' },
          path: { const: '/users/{userId}' },
          method: { const: 'GET' },
          pathParameters: pathParametersSchema,
          queryStringParameters: queryStringParametersSchema,
          headers: headersSchema,
          body: bodySchema,
          outputs: {
            type: 'object',
            properties: {
              '200': outputSchema,
            },
            required: ['200'],
          },
        },
        required: [
          'contractId',
          'contractType',
          'path',
          'method',
          'pathParameters',
          'queryStringParameters',
          'headers',
          'body',
          'outputs',
        ],
        additionalProperties: false,
      });
    });
  });

  describe('restAPi, when all parameters are set', () => {
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

    it('should have the correct fullContractSchema', () => {
      expect(getFullContractSchema(restApiContract)).toEqual({
        type: 'object',
        properties: {
          contractId: { const: 'testContract' },
          contractType: { const: 'restApi' },
          path: { const: '/users/{userId}' },
          method: { const: 'GET' },
          pathParameters: pathParametersSchema,
          queryStringParameters: queryStringParametersSchema,
          headers: headersSchema,
          body: bodySchema,
          outputs: {
            type: 'object',
            properties: {
              '200': outputSchema,
            },
            required: ['200'],
          },
        },
        required: [
          'contractId',
          'contractType',
          'path',
          'method',
          'pathParameters',
          'queryStringParameters',
          'headers',
          'body',
          'outputs',
        ],
        additionalProperties: false,
      });
    });
  });
});
