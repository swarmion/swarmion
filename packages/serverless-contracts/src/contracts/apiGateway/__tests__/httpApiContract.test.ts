/* eslint-disable max-lines */
import { ApiGatewayContract } from '../apiGatewayContract';
import {
  getCompleteTrigger,
  getFullContractSchema,
  getInputSchema,
  getOpenApiDocumentation,
  getTrigger,
} from '../features';

describe('httpApiContract', () => {
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

  describe('when all parameters are set', () => {
    const httpApiContract = new ApiGatewayContract({
      id: 'testContract',
      path: '/users/{userId}',
      method: 'GET',
      integrationType: 'httpApi',
      pathParametersSchema,
      queryStringParametersSchema,
      headersSchema,
      bodySchema,
      outputSchema,
    });

    it('should have the correct trigger', () => {
      expect(getTrigger(httpApiContract)).toEqual({
        httpApi: {
          path: '/users/{userId}',
          method: 'GET',
        },
      });
    });

    it('should have the correct complete trigger', () => {
      expect(
        getCompleteTrigger(httpApiContract, { authorizer: '123' }),
      ).toEqual({
        httpApi: {
          path: '/users/{userId}',
          method: 'GET',
          authorizer: '123',
        },
      });
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

    it('should have the correct outputSchema', () => {
      expect(httpApiContract.outputSchema).toEqual(outputSchema);
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
          output: outputSchema,
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
          'output',
        ],
        additionalProperties: false,
      });
    });

    it('should generate open api documentation', () => {
      expect(getOpenApiDocumentation(httpApiContract)).toEqual({
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
              description: 'Success',
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
          },
        },
      });
    });
  });
});
