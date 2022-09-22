import { EventBridgeContract } from '../eventBridgeContract';

export type EventBridgeLambdaTrigger<Contract extends EventBridgeContract> = {
  pattern: {
    source: [Contract['source']];
    'detail-type': [Contract['eventType']];
  };
  eventBus: string;
};

export type EventBridgeTriggerArgs<Contract extends EventBridgeContract> = [
  Contract,
  { eventBus: string },
];
