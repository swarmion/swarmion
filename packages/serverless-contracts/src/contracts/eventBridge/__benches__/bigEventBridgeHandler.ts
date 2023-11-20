import Ajv from 'ajv';
import { JSONSchema } from 'json-schema-to-ts';

import { EventBridgeContract } from 'contracts';
import { getHandler } from 'features';

const ajv = new Ajv({ keywords: ['faker'] });

// object with 200 properties to test the performance
const bigObject: Record<string, JSONSchema> = {};
for (let i = 0; i < 200; i++) {
  bigObject[`prop${i}`] = { type: 'string' };
}

const eventBridgeContract = new EventBridgeContract({
  id: 'myAwesomeEventBridgeContract',
  sources: ['toto.tata'] as const,
  eventType: 'MY_DETAIL_TYPE',
  payloadSchema: {
    type: 'object',
    properties: { userId: { type: 'string' }, ...bigObject },
    required: ['userId'],
    additionalProperties: false,
  } as const,
});

export const handler = getHandler(eventBridgeContract, { ajv })(async event => {
  await Promise.resolve();

  return event.detail.userId;
});
