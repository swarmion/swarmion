import { z, ZodSchema } from 'zod';

import { EventBridgeContract } from './EventBridgeContract';

export type EventBridgePayloadType<Contract extends EventBridgeContract> =
  Contract['payloadSchema'] extends ZodSchema
    ? z.infer<Contract['payloadSchema']>
    : void;
