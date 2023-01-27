import {
  APIGatewayEventRequestContextV2WithAuthorizer,
  APIGatewayProxyCallback,
  APIGatewayProxyCallbackV2,
  APIGatewayProxyEventBase,
  APIGatewayProxyEventV2WithRequestContext,
  APIGatewayProxyResult,
  APIGatewayProxyResultV2,
  Context,
} from 'aws-lambda';

import { AuthorizerContext } from './authorizerContext';
import {
  ApiGatewayAuthorizerType,
  ApiGatewayIntegrationType,
} from './constants';

type HandlerCallback<IntegrationType> = IntegrationType extends 'restApi'
  ? APIGatewayProxyCallback
  : APIGatewayProxyCallbackV2;

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
