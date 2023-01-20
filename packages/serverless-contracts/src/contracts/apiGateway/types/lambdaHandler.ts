import type {
  APIGatewayEventRequestContextV2WithAuthorizer,
  APIGatewayEventRequestContextWithAuthorizer,
  Callback,
  Context,
} from 'aws-lambda';

import { GenericApiGatewayContract } from '../apiGatewayContract';
import { AuthorizerContext } from './authorizerContext';
import {
  BodyType,
  CustomRequestContextType,
  HeadersType,
  OutputType,
  PathParametersType,
  QueryStringParametersType,
} from './common';
import {
  ApiGatewayAuthorizerType,
  ApiGatewayIntegrationType,
} from './constants';
import { DefinedProperties } from './utils';

export type RequestContext<
  IntegrationType extends ApiGatewayIntegrationType,
  AuthorizerType extends ApiGatewayAuthorizerType,
  CustomRequestContext,
> = (IntegrationType extends 'restApi'
  ? APIGatewayEventRequestContextWithAuthorizer<
      AuthorizerContext<AuthorizerType>
    >
  : APIGatewayEventRequestContextV2WithAuthorizer<
      AuthorizerContext<AuthorizerType>
    >) &
  (CustomRequestContext extends undefined ? unknown : CustomRequestContext);

export type HandlerEventType<
  IntegrationType extends ApiGatewayIntegrationType,
  AuthorizerType extends ApiGatewayAuthorizerType,
  PathParameters,
  QueryStringParameters,
  Headers,
  CustomRequestContext,
  Body,
> = DefinedProperties<{
  requestContext: RequestContext<
    IntegrationType,
    AuthorizerType,
    CustomRequestContext
  >;
  pathParameters: PathParameters;
  queryStringParameters: QueryStringParameters;
  headers: Headers;
  body: Body;
}>;

/**
 * The **internal** type of a Swarmion handler, with type-inferred event
 * The handler function can define additional arguments.
 *
 * For external use, prefer `SwarmionApiGatewayHandler`
 */
export type InternalSwarmionApiGatewayHandler<
  IntegrationType extends ApiGatewayIntegrationType,
  AuthorizerType extends ApiGatewayAuthorizerType,
  PathParameters,
  QueryStringParameters,
  Headers,
  CustomRequestContext,
  Body,
  Output,
  AdditionalArgs extends unknown[] = never[],
  Event = HandlerEventType<
    IntegrationType,
    AuthorizerType,
    PathParameters,
    QueryStringParameters,
    Headers,
    CustomRequestContext,
    Body
  >,
> = (
  event: Event,
  context: Context,
  callback?: Callback,
  ...additionalArgs: AdditionalArgs
) => Promise<Output>;

/**
 * The type of a Swarmion handler, with type-inferred event
 * The handler function can define additional arguments.
 */
export type SwarmionApiGatewayHandler<
  Contract extends GenericApiGatewayContract,
  AdditionalArgs extends unknown[] = never[],
  IntegrationType extends ApiGatewayIntegrationType = Contract['integrationType'],
  AuthorizerType extends ApiGatewayAuthorizerType = Contract['authorizerType'],
  PathParameters = PathParametersType<Contract>,
  QueryStringParameters = QueryStringParametersType<Contract>,
  Headers = HeadersType<Contract>,
  CustomRequestContext = CustomRequestContextType<Contract>,
  Body = BodyType<Contract>,
  Output = OutputType<Contract>,
> = InternalSwarmionApiGatewayHandler<
  IntegrationType,
  AuthorizerType,
  PathParameters,
  QueryStringParameters,
  Headers,
  CustomRequestContext,
  Body,
  Output,
  AdditionalArgs
>;
