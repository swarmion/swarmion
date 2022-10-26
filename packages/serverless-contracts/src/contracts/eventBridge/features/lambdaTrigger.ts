import { EventBridgeContract } from '../eventBridgeContract';
import {
  EventBridgeLambdaTrigger,
  EventBridgeTriggerArgs,
} from '../types/lambdaTrigger';

/**
 * Returns a basic serverless function trigger associated to an EventBridgeContract
 *
 * @argument contract your EventBridgeContract
 */
export const getEventBridgeTrigger = <Contract extends EventBridgeContract>(
  contract: Contract,
  { eventBus }: EventBridgeTriggerArgs,
): EventBridgeLambdaTrigger<Contract> => ({
  eventBridge: {
    pattern: {
      source: contract.sources,
      'detail-type': [contract.eventType],
    },
    eventBus,
  },
});
