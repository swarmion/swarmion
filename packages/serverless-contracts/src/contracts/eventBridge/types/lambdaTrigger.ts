import { EventBridgeContract } from '../eventBridgeContract';

export type EventBridgeLambdaTrigger<
  Contract extends EventBridgeContract,
  EventBus extends string,
> = {
  pattern: {
    source: [Contract['source']];
    'detail-type': [Contract['eventType']];
  };
  eventBus: EventBus;
};
