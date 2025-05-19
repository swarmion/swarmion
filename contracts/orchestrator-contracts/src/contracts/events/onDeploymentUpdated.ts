import { EventBridgeContract } from '@swarmion/serverless-contracts';

export const onDeploymentUpdatedContract = new EventBridgeContract({
  id: 'orchestrator-onDeploymentUpdated',
  eventType: 'UPDATED_DEPLOYMENT',
  sources: ['swarmion.orchestrator'] as const,
  payloadSchema: {
    type: 'object',
    properties: {
      serviceId: { type: 'string' },
      applicationId: { type: 'string' },
      eventId: { type: 'string' },
      status: { type: 'string' },
    },
    required: ['serviceId', 'applicationId', 'eventId', 'status'],
    additionalProperties: false,
  } as const,
});
