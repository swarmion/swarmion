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
  id: 'forum-getThreadWithPosts',
  path: '/forum/thread/{threadId}',
  method: 'POST',
  integrationType: 'httpApi',
  pathParametersSchema: undefined,
  queryStringParametersSchema: undefined,
  bodySchema,
  headersSchema: undefined,
  outputSchema,
});
