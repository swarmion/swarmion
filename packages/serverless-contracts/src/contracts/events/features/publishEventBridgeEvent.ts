import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { FromSchema, JSONSchema } from 'json-schema-to-ts';
import { Bus, Event } from 'typebridge';

import { EventBridgeEventContract } from '../eventBridgeEventContract';

export const publishEventBridgeEvent = async <
  Contract extends EventBridgeEventContract,
  S extends JSONSchema = Contract['payloadSchema'],
>(
  contract: Contract,
  eventBridgeClient: EventBridgeClient,
  payload: Contract['payloadSchema'],
): Promise<void> => {
  const { source, payloadSchema, name } = contract;
  const bus = new Bus({
    name: contract.busName,
    EventBridge: eventBridgeClient,
  });

  const event = new Event<string, S, FromSchema<S>>({
    source,
    bus,
    schema: payloadSchema,
    name,
  });

  await event.publish(payload);
};
