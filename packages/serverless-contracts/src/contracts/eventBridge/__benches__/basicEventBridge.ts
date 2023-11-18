import Ajv from 'ajv';

import { EventBridgeContract } from 'contracts';
import { getHandler } from 'features';

const ajv = new Ajv({ keywords: ['faker'] });

const eventBridgeContract = new EventBridgeContract({
  id: 'myAwesomeEventBridgeContract',
  sources: ['toto.tata'] as const,
  eventType: 'MY_DETAIL_TYPE',
  payloadSchema: {
    type: 'object',
    properties: { userId: { type: 'string' } },
    required: ['userId'],
    additionalProperties: false,
  } as const,
});

export const handler = getHandler(eventBridgeContract, { ajv })(async event => {
  await Promise.resolve();

  return event.detail.userId;
});
