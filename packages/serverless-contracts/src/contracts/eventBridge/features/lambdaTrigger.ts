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
export const getTrigger = <Contract extends EventBridgeContract>(
  ...[contract, { eventBus }]: EventBridgeTriggerArgs<Contract>
): EventBridgeLambdaTrigger<Contract> => ({
  pattern: {
    source: [contract.source],
    'detail-type': [contract.eventType],
  },
  eventBus,
});
