import {
  ApiGatewayHandler,
  EventBridgeContract,
  EventBridgeHandler,
  EventBridgePayloadType,
  GenericApiGatewayContract,
  getApiGatewayHandler,
  getEventBridgeHandler,
  SwarmionEventBridgeHandler,
} from 'contracts';
import {
  BodyType,
  CustomRequestContextType,
  HeadersType,
  InternalSwarmionApiGatewayHandler,
  OutputType,
  PathParametersType,
  QueryStringParametersType,
} from 'contracts/apiGateway/types';
import {
  ApiGatewayAuthorizerType,
  ApiGatewayIntegrationType,
} from 'contracts/apiGateway/types/constants';
import { ServerlessContract } from 'types';

/**
 * must match the type of getApiGatewayHandler
 */
export function getHandler<
  Contract extends GenericApiGatewayContract,
  IntegrationType extends ApiGatewayIntegrationType = Contract['integrationType'],
  AuthorizerType extends ApiGatewayAuthorizerType = Contract['authorizerType'],
  PathParameters = PathParametersType<Contract>,
  QueryStringParameters = QueryStringParametersType<Contract>,
  Headers = HeadersType<Contract>,
  CustomRequestContext = CustomRequestContextType<Contract>,
  Body = BodyType<Contract>,
  Output = OutputType<Contract>,
>(
  contract: Contract,
): <AdditionalArgs extends unknown[] = never[]>(
  handler: InternalSwarmionApiGatewayHandler<
    IntegrationType,
    AuthorizerType,
    PathParameters,
    QueryStringParameters,
    Headers,
    CustomRequestContext,
    Body,
    Output,
    AdditionalArgs
  >,
) => ApiGatewayHandler<IntegrationType, AuthorizerType, Output, AdditionalArgs>;

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
