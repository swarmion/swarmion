import { EventBridgeEvent as AwsEventBridgeEvent } from 'aws-lambda';
import { FromSchema, JSONSchema } from 'json-schema-to-ts';

import { EventBridgeContract } from '../eventBridgeContract';

export type EventBridgePayloadType<Contract extends EventBridgeContract> =
  Contract['payloadSchema'] extends JSONSchema
    ? FromSchema<Contract['payloadSchema']>
    : void;

export type EventBridgeEvent<Contract extends EventBridgeContract> =
  AwsEventBridgeEvent<Contract['eventType'], EventBridgePayloadType<Contract>>;
