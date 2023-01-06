import type {
  APIGatewayEventRequestContextJWTAuthorizer,
  APIGatewayEventRequestContextLambdaAuthorizer,
  APIGatewayEventRequestContextV2WithAuthorizer,
  APIGatewayEventRequestContextWithAuthorizer,
  APIGatewayProxyCallback,
  APIGatewayProxyCallbackV2,
  APIGatewayProxyCognitoAuthorizer,
  APIGatewayProxyEventBase,
  APIGatewayProxyEventV2WithRequestContext,
  APIGatewayProxyResult,
  APIGatewayProxyResultV2,
  Callback,
  Context,
} from 'aws-lambda';

import { GenericApiGatewayContract } from '../apiGatewayContract';
import {
  BodyType,
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

type AuthorizerContext<AuthorizerType extends ApiGatewayAuthorizerType> =
  AuthorizerType extends 'cognito'
    ? APIGatewayProxyCognitoAuthorizer
    : AuthorizerType extends 'jwt'
    ? APIGatewayEventRequestContextJWTAuthorizer
    : AuthorizerType extends 'lambda'
    ? // We use unknown for now because we would need another schema to define the authorizer context
      APIGatewayEventRequestContextLambdaAuthorizer<unknown>
    : undefined;

export type RequestContext<
  IntegrationType extends ApiGatewayIntegrationType,
  AuthorizerType extends ApiGatewayAuthorizerType,
> = IntegrationType extends 'restApi'
  ? APIGatewayEventRequestContextWithAuthorizer<
      AuthorizerContext<AuthorizerType>
    >
  : APIGatewayEventRequestContextV2WithAuthorizer<
      AuthorizerContext<AuthorizerType>
    >;

export type HandlerEventType<
  IntegrationType extends ApiGatewayIntegrationType,
  AuthorizerType extends ApiGatewayAuthorizerType,
  PathParameters,
  QueryStringParameters,
  Headers,
  Body,
> = DefinedProperties<{
  requestContext: RequestContext<IntegrationType, AuthorizerType>;
  pathParameters: PathParameters;
  queryStringParameters: QueryStringParameters;
  headers: Headers;
  body: Body;
}>;

type HandlerCallback<IntegrationType> = IntegrationType extends 'restApi'
  ? APIGatewayProxyCallback
  : APIGatewayProxyCallbackV2;

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
  Body,
  Output,
  AdditionalArgs extends unknown[] = never[],
  Event = HandlerEventType<
    IntegrationType,
    AuthorizerType,
    PathParameters,
    QueryStringParameters,
    Headers,
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
  Body = BodyType<Contract>,
  Output = OutputType<Contract>,
> = InternalSwarmionApiGatewayHandler<
  IntegrationType,
  AuthorizerType,
  PathParameters,
  QueryStringParameters,
  Headers,
  Body,
  Output,
  AdditionalArgs
>;

/**
 * The type of an ApiGateway event. This is the actual event that will
 * be passed to the lambda, not the Swarmion inferred one.
 *
 * See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html.
 */
export type ApiGatewayEvent<
  IntegrationType extends ApiGatewayIntegrationType,
  AuthorizerType extends ApiGatewayAuthorizerType,
> = IntegrationType extends 'restApi'
  ? APIGatewayProxyEventBase<AuthorizerContext<AuthorizerType>>
  : APIGatewayProxyEventV2WithRequestContext<
      APIGatewayEventRequestContextV2WithAuthorizer<
        AuthorizerContext<AuthorizerType>
      >
    >;

/**
 * The type of an ApiGateway event. This is the actual event that will
 * be passed to the lambda, not the Swarmion inferred one.
 *
 * See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html.
 */
export type ApiGatewayResult<
  IntegrationType extends ApiGatewayIntegrationType,
  Output,
> = IntegrationType extends 'restApi'
  ? APIGatewayProxyResult
  : APIGatewayProxyResultV2<Output>;

/**
 * The type of an ApiGateway handler. This is the actual version that will
 * be executed by the lambda, not the Swarmion inferred one.
 *
 * See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html.
 */
export type ApiGatewayHandler<
  IntegrationType extends ApiGatewayIntegrationType,
  AuthorizerType extends ApiGatewayAuthorizerType,
  Output,
  AdditionalArgs extends unknown[] = never[],
> = (
  event: ApiGatewayEvent<IntegrationType, AuthorizerType>,
  context: Context,
  callback: HandlerCallback<IntegrationType>,
  ...additionalArgs: AdditionalArgs
) => Promise<ApiGatewayResult<IntegrationType, Output>>;
