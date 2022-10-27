import {
  ApiGatewayContract,
  ApiGatewayHandler,
  EventBridgeContract,
  EventBridgeHandler,
  EventBridgePayloadType,
  getApiGatewayHandler,
  getEventBridgeHandler,
  SwarmionApiGatewayHandler,
  SwarmionEventBridgeHandler,
} from 'contracts';
import { ServerlessContract } from 'types';

/**
 * must match the type of getApiGatewayHandler
 */
export function getHandler<Contract extends ApiGatewayContract>(
  contract: Contract,
): (
  handler: SwarmionApiGatewayHandler<Contract>,
) => ApiGatewayHandler<Contract>;

/**
 * must match the type of getEventBridgeHandler
 */
export function getHandler<
  Contract extends EventBridgeContract,
  EventType extends string = Contract['eventType'],
  Payload = EventBridgePayloadType<Contract>,
>(
  contract: Contract,
): <AdditionalArgs extends unknown[]>(
  handler: SwarmionEventBridgeHandler<EventType, Payload, AdditionalArgs>,
) => EventBridgeHandler<EventType, Payload, AdditionalArgs>;

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function getHandler<Contract extends ServerlessContract>(
  contract: Contract,
): unknown {
  switch (contract.contractType) {
    case 'eventBridge':
      return getEventBridgeHandler(contract);
    case 'apiGateway':
      return getApiGatewayHandler(contract);
    case 'cloudFormation':
      throw new Error('CloudFormation contract has no handler');
    default:
      // exhaustiveness check
      // eslint-disable-next-line no-case-declarations
      const _neverContract: never = contract;
      console.error('Not implemented for contract', _neverContract);
      throw new Error('Not implemented');
  }
}
