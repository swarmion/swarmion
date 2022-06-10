import { ApiGatewayContract } from '../apiGatewayContract';

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

  describe('hhtpApi, when all parameters are set', () => {
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
        additionalProperties: true,
      });
    });

    it('should have the correct outputSchema', () => {
      expect(httpApiContract.outputSchema).toEqual(outputSchema);
    });
  });

  describe('restApi, when all parameters are set', () => {
    const restApiContract = new ApiGatewayContract({
      id: 'testContract',
      path: '/users/{userId}',
      method: 'GET',
      integrationType: 'restApi',
      hasAuthorizer: false,
      pathParametersSchema,
      queryStringParametersSchema,
      headersSchema,
      bodySchema,
      outputSchema,
    });

    it('should have the correct inputSchema', () => {
      expect(restApiContract.inputSchema).toEqual({
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
      expect(restApiContract.outputSchema).toEqual(outputSchema);
    });
  });

  describe('restAPi, when it is instanciated with a subset of schemas', () => {
    const restApiContract = new ApiGatewayContract({
      id: 'testContractRest',
      path: 'coucou',
      method: 'POST',
      integrationType: 'restApi',
      hasAuthorizer: false,
      pathParametersSchema: undefined,
      queryStringParametersSchema: undefined,
      headersSchema: undefined,
      bodySchema: undefined,
      outputSchema: undefined,
    });
    it('should should have the correct outputSchema', () => {
      expect(restApiContract.outputSchema).toEqual(undefined);
    });

    it('should should have the correct inputSchema', () => {
      expect(restApiContract.inputSchema).toEqual({
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: true,
      });
    });
  });
});
