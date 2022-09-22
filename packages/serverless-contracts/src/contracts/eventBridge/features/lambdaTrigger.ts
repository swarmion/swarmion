import { EventBridgeContract } from '../eventBridgeContract';
import { EventBridgeLambdaTrigger } from '../types/lambdaTrigger';

/**
 * Returns a basic serverless function trigger associated to an EventBridgeContract
 *
 * @argument contract your EventBridgeContract
 */
export const getTrigger = <
  Contract extends EventBridgeContract,
  EventBus extends string,
>(
  contract: Contract,
  { eventBus }: { eventBus: EventBus },
): EventBridgeLambdaTrigger<Contract, EventBus> => ({
  pattern: {
    source: [contract.source],
    'detail-type': [contract.eventType],
  },
  eventBus,
});
