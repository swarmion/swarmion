import { ApiGatewayContract } from '@swarmion/serverless-contracts';

const queryStringParametersSchema = {
  type: 'object',
  properties: {
    applicationId: { type: 'string' },
  },
  required: [],
  additionalProperties: false,
} as const;

const outputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
  },
  required: ['id'],
  additionalProperties: false,
} as const;

export const listDeploymentsContract = new ApiGatewayContract({
  id: 'orchestrator-listDeployments',
  path: '/deployments',
  method: 'GET',
  integrationType: 'httpApi',
  pathParametersSchema: undefined,
  queryStringParametersSchema,
  bodySchema: undefined,
  headersSchema: undefined,
  outputSchema,
  authorizerType: undefined,
});
