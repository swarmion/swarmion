import { ApiGatewayContract } from '../apiGatewayContract';

describe('restApiContract', () => {
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
        additionalProperties: true,
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
        additionalProperties: false,
      });
    });

    it('should be requestable with no parameters', () => {
      expect(restApiContract.getRequestParameters({})).toEqual({
        path: 'coucou',
        method: 'POST',
      });
    });

    it('should generate open api documentation', () => {
      expect(restApiContract.openApiDocumentation).toEqual({
        path: 'coucou',
        method: 'post',
        documentation: {
          responses: {
            '200': {
              description: 'Success',
            },
          },
        },
      });
    });
  });
});
