import { ApiGatewayContract } from '@swarmion/serverless-contracts';

const bodySchema = {
  type: 'object',
  properties: {
    serviceId: { type: 'string' },
  },
  required: ['serviceId'],
  additionalProperties: false,
} as const;

const outputSchema = {
  type: 'object',
  properties: {
    serviceId: { type: 'string' },
  },
  required: ['serviceId'],
  additionalProperties: false,
} as const;

export const requestSyncDeployment = new ApiGatewayContract({
  id: 'orchestrator-requestSyncDeployment',
  path: '/request-sync-deployment',
  method: 'POST',
  integrationType: 'httpApi',
  pathParametersSchema: undefined,
  queryStringParametersSchema: undefined,
  bodySchema,
  headersSchema: undefined,
  outputSchema,
});
