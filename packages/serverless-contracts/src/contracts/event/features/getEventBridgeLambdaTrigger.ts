import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { Bus, Event } from 'typebridge';

import { EventBridgeEventContract } from '../eventBridgeEventContract';
import { EventBridgeLambdaCompleteTriggerType } from '../types';

export const getEventBridgeLambdaTrigger = <
  Contract extends EventBridgeEventContract,
>(
  contract: Contract,
  eventBus: Record<string, string[]>,
  additionalConfig?: EventBridgeLambdaCompleteTriggerType['eventBridge'],
): EventBridgeLambdaCompleteTriggerType => {
  const { source, payloadSchema, name } = contract;

  const eventBridgeClient = new EventBridgeClient({});

  const bus = new Bus({
    name: contract.busName,
    EventBridge: eventBridgeClient,
  });

  const event = new Event({
    source,
    bus,
    schema: payloadSchema,
    name,
  });

  return {
    eventBridge: {
      eventBus,
      pattern: event.pattern,
      ...additionalConfig,
    },
  };
};
