import { FromSchema, JSONSchema } from 'json-schema-to-ts';

import { EventBridgeContract } from '../eventBridgeContract';

export type PayloadType<Contract extends EventBridgeContract> =
  Contract['payloadSchema'] extends JSONSchema
    ? FromSchema<Contract['payloadSchema']>
    : void;
