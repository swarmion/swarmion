import {Event, Bus} from 'typebridge';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';

import { EventBridgeEventContract } from '../eventBridgeEventContract';

export const publishEventBridgeEvent = <Contract extends EventBridgeEventContract>(
  contract: Contract,
  eventBridgeClient: EventBridgeClient,
  payload: Contract['payloadSchema'],
): Promise<void> => {
  const {source, payloadSchema, name} = contract;
  const bus = new Bus({
    name: contract.busName,
    EventBridge: new EventBridgeClient({}),
  });
  const event = new Event<>({
    source,
    bus,
    schema: payloadSchema,
    name,
  });
};
