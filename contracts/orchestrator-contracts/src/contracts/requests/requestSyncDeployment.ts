import { ApiGatewayContract } from '@swarmion/serverless-contracts';

const bodySchema = {
  type: 'object',
  properties: {
    serviceId: { type: 'string' },
    applicationId: { type: 'string' },
  },
  required: ['serviceId', 'applicationId'],
  additionalProperties: false,
} as const;

const outputSchema = {
  type: 'object',
  properties: {
    status: { enum: ['ACCEPTED', 'REJECTED'] },
    message: { type: 'string' },
  },
  required: ['status', 'message'],
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
  hasAuthorizer: false,
});
