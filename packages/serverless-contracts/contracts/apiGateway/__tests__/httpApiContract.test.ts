/* eslint-disable max-lines */
import { ApiGatewayContract } from '../apiGatewayContract';

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
      expect(httpApiContract.trigger).toEqual({
        httpApi: {
          path: '/users/{userId}',
          method: 'GET',
        },
      });
    });

    it('should have the correct complete trigger', () => {
      expect(httpApiContract.getCompleteTrigger({ authorizer: '123' })).toEqual(
        {
          httpApi: {
            path: '/users/{userId}',
            method: 'GET',
            authorizer: '123',
          },
        },
      );
    });

    it('should have the correct inputSchema', () => {
      expect(httpApiContract.inputSchema).toEqual({
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
      });
    });

    it('should have the correct outputSchema', () => {
      expect(httpApiContract.outputSchema).toEqual(outputSchema);
    });

    it('should have the correct fullContractSchema', () => {
      expect(httpApiContract.fullContractSchema).toEqual({
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
      });
    });

    it('should be requestable with the correct parameters', () => {
      expect(
        httpApiContract.getRequestParameters({
          pathParameters: { userId: '123', pageNumber: '12' },
          headers: { myHeader: '12' },
          queryStringParameters: { testId: '155' },
          body: { foo: 'bar' },
        }),
      ).toEqual({
        method: 'GET',
        path: '/users/123',
        headers: { myHeader: '12' },
        queryStringParameters: { testId: '155' },
        body: { foo: 'bar' },
      });
    });
  });

  describe('when it is instanciated with a subset of schemas', () => {
    const restApiContract = new ApiGatewayContract({
      id: 'testContractRest',
      path: 'coucou',
      method: 'POST',
      integrationType: 'restApi',
      pathParametersSchema: undefined,
      queryStringParametersSchema: undefined,
      headersSchema: undefined,
      bodySchema: undefined,
      outputSchema: undefined,
    });

    it('should have the correct simple trigger', () => {
      expect(restApiContract.trigger).toEqual({
        http: {
          path: 'coucou',
          method: 'POST',
        },
      });
    });

    it('should have the correct complete trigger', () => {
      expect(
        restApiContract.getCompleteTrigger({
          authorizer: '123',
          connectionId: '456',
        }),
      ).toEqual({
        http: {
          path: 'coucou',
          method: 'POST',
          authorizer: '123',
          connectionId: '456',
        },
      });
    });

    it('should should have the correct outputSchema', () => {
      expect(restApiContract.outputSchema).toEqual(undefined);
    });

    it('should should have the correct inputSchema', () => {
      expect(restApiContract.inputSchema).toEqual({
        type: 'object',
        properties: {},
        required: [],
      });
    });

    it('should have the correct fullContractSchema', () => {
      expect(restApiContract.fullContractSchema).toEqual({
        type: 'object',
        properties: {
          contractId: { const: 'testContractRest' },
          contractType: { const: 'restApi' },
          path: { const: 'coucou' },
          method: { const: 'POST' },
        },
        required: ['contractId', 'contractType', 'path', 'method'],
      });
    });

    it('should be requestable with no parameters', () => {
      expect(restApiContract.getRequestParameters({})).toEqual({
        path: 'coucou',
        method: 'POST',
      });
    });
  });
});
