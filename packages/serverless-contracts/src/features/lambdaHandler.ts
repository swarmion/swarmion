import {
  ApiGatewayHandler,
  EventBridgeContract,
  EventBridgeHandler,
  EventBridgePayloadType,
  GenericApiGatewayContract,
  getApiGatewayHandler,
  getEventBridgeHandler,
  getSQSHandler,
  SQSContract,
  SQSHandler,
  SwarmionEventBridgeHandler,
  SwarmionLambdaSQSHandler,
  SwarmionSQSHandler,
} from 'contracts';
import { GetApiGatewayHandlerOptions } from 'contracts/apiGateway/features';
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
import { GetEventBridgeHandlerOptions } from 'contracts/eventBridge/features';
import { ServerlessContract } from 'types';

import {
  GetSQSHandlerOptions,
  SqsMessageAttributesType,
  SqsMessageBodyType,
} from '../contracts/SQS/types';

type GetHandlerOptions<Contract extends ServerlessContract> =
  Contract extends GenericApiGatewayContract
    ? Partial<GetApiGatewayHandlerOptions>
    : Contract extends EventBridgeContract
      ? Partial<GetEventBridgeHandlerOptions>
      : never;

/**
 * must match the type of getApiGatewayHandler
 */
export function getHandler<
  Contract extends GenericApiGatewayContract,
  IntegrationType extends
    ApiGatewayIntegrationType = Contract['integrationType'],
  AuthorizerType extends ApiGatewayAuthorizerType = Contract['authorizerType'],
  PathParameters = PathParametersType<Contract>,
  QueryStringParameters = QueryStringParametersType<Contract>,
  Headers = HeadersType<Contract>,
  CustomRequestContext = CustomRequestContextType<Contract>,
  Body = BodyType<Contract>,
  Output = OutputType<Contract>,
>(
  contract: Contract,
  options: GetApiGatewayHandlerOptions,
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
  options: GetEventBridgeHandlerOptions,
): <AdditionalArgs extends unknown[]>(
  handler: SwarmionEventBridgeHandler<EventType, Payload, AdditionalArgs>,
) => EventBridgeHandler<EventType, Payload, AdditionalArgs>;

/**
 * must match the type of getSQSHandler
 */
export function getHandler<
  Contract extends SQSContract,
  MessageBody = SqsMessageBodyType<Contract>,
  MessageAttributes = SqsMessageAttributesType<Contract>,
  HandleRecords extends boolean = true,
>(
  contract: Contract,
  options: GetSQSHandlerOptions<HandleRecords>,
): <AdditionalArgs extends unknown[]>(
  handler: HandleRecords extends false
    ? SwarmionLambdaSQSHandler<MessageBody, MessageAttributes, AdditionalArgs>
    : SwarmionSQSHandler<MessageBody, MessageAttributes, AdditionalArgs>,
) => SQSHandler<AdditionalArgs>;

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function getHandler<Contract extends ServerlessContract>(
  contract: Contract,
  options: GetHandlerOptions<Contract>,
): unknown {
  switch (contract.contractType) {
    case 'eventBridge':
      return getEventBridgeHandler(
        contract,
        options as GetEventBridgeHandlerOptions,
      );
    case 'apiGateway':
      return getApiGatewayHandler(
        contract,
        options as GetApiGatewayHandlerOptions,
      );
    case 'SQS':
      return getSQSHandler(contract, options as GetSQSHandlerOptions<boolean>);
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
