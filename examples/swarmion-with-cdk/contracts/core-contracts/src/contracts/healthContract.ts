import { ApiGatewayContract } from '@swarmion/serverless-contracts';

const queryStringParametersSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
  },
  required: ['message'],
  additionalProperties: false,
} as const;

const outputSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
  },
  required: ['message'],
  additionalProperties: false,
} as const;

const healthContract = new ApiGatewayContract({
  id: 'get-health',
  path: '/health',
  method: 'GET',
  bodySchema: undefined,
  headersSchema: undefined,
  integrationType: 'restApi',
  outputSchema,
  pathParametersSchema: undefined,
  queryStringParametersSchema,
  authorizerType: undefined,
});

export default healthContract;
