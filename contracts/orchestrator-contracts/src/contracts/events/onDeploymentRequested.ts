import { EventBridgeContract } from '@swarmion/serverless-contracts';

export const onDeploymentRequestedContract = new EventBridgeContract({
  id: 'orchestrator-onDeploymentRequested',
  eventType: 'REQUESTED_DEPLOYMENT',
  sources: ['swarmion.orchestrator'] as const,
  payloadSchema: {
    type: 'object',
    properties: {
      serviceId: { type: 'string' },
      applicationId: { type: 'string' },
      eventId: { type: 'string' },
    },
    required: ['serviceId', 'applicationId', 'eventId'],
    additionalProperties: false,
  } as const,
});
