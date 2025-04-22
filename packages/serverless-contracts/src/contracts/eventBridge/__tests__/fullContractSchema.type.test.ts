import { JSONSchema } from 'json-schema-to-ts';

import { EventBridgeContract } from '../eventBridgeContract';
import { FullContractSchemaType } from '../types/fullContract';
const eventBridgeContract = new EventBridgeContract({
  id: 'myAwesomeEventBridgeContract',
  sources: ['toto.tata'] as const,
  eventType: 'MY_DETAIL_TYPE',
  payloadSchema: { type: 'object' } as const,
});

type Check =
  FullContractSchemaType<typeof eventBridgeContract> extends JSONSchema
    ? 'pass'
    : 'fail';

const check: Check = 'pass';
check;
