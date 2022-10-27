import { EventBridgeContract } from '../eventBridgeContract';

export type EventBridgeLambdaTrigger<Contract extends EventBridgeContract> = {
  eventBridge: {
    pattern: {
      source: Contract['sources'];
      'detail-type': [Contract['eventType']];
    };
    eventBus: string;
  };
};

/**
 * the EventBridge arguments other than the contract itself
 */
export type EventBridgeTriggerArgs = { eventBus: string };
