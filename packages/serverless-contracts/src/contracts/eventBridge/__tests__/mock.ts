import { EventBridgeContract } from '../eventBridgeContract';

export const eventBridgeContract = new EventBridgeContract({
  id: 'myAwesomeEventBridgeContract',
  sources: ['toto.tata', 'titi.tutu'] as const,
  eventType: 'MY_DETAIL_TYPE',
  payloadSchema: {
    type: 'object',
    properties: {
      userId: { type: 'string' },
      myOtherProp: { type: 'string' },
    },
    required: ['userId', 'myOtherProp'],
    additionalProperties: false,
  } as const,
});
