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
  Context,
} from 'aws-lambda';
import { FromSchema } from 'json-schema-to-ts';

import { ApiGatewayContract } from '../apiGatewayContract';
import { OutputType } from './common';
import {
  ApiGatewayAuthorizerType,
  ApiGatewayIntegrationType,
} from './constants';
import { InputSchemaType } from './input';
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

export type HandlerEventType<Contract extends ApiGatewayContract> =
  DefinedProperties<{
    requestContext: RequestContext<
      Contract['integrationType'],
      Contract['authorizerType']
    >;
  }> &
    FromSchema<
      InputSchemaType<
        Contract['pathParametersSchema'],
        Contract['queryStringParametersSchema'],
        Contract['headersSchema'],
        Contract['bodySchema'],
        false
      >
    >;

type HandlerCallback<Contract extends ApiGatewayContract> =
  Contract['integrationType'] extends 'restApi'
    ? APIGatewayProxyCallback
    : APIGatewayProxyCallbackV2;

/**
 * The type of a Swarmion handler, with type-inferred event
 * The handler function can define additional arguments
 */
export type SwarmionApiGatewayHandler<Contract extends ApiGatewayContract> = (
  event: HandlerEventType<Contract>,
  context: Context,
  ...additionalArgs: never[]
) => Promise<OutputType<Contract>>;

/**
 * The type of an ApiGateway event. This is the actual event that will
 * be passed to the lambda, not the Swarmion inferred one.
 *
 * See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html.
 */
export type ApiGatewayEvent<Contract extends ApiGatewayContract> =
  Contract['integrationType'] extends 'restApi'
    ? APIGatewayProxyEventBase<AuthorizerContext<Contract['authorizerType']>>
    : APIGatewayProxyEventV2WithRequestContext<
        APIGatewayEventRequestContextV2WithAuthorizer<
          AuthorizerContext<Contract['authorizerType']>
        >
      >;

/**
 * The type of an ApiGateway event. This is the actual event that will
 * be passed to the lambda, not the Swarmion inferred one.
 *
 * See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html.
 */
export type ApiGatewayResult<Contract extends ApiGatewayContract> =
  Contract['integrationType'] extends 'restApi'
    ? APIGatewayProxyResult
    : APIGatewayProxyResultV2<OutputType<Contract>>;

/**
 * The type of an ApiGateway handler. This is the actual version that will
 * be executed by the lambda, not the Swarmion inferred one.
 *
 * See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html.
 */
export type ApiGatewayHandler<Contract extends ApiGatewayContract> = (
  event: ApiGatewayEvent<Contract>,
  context: Context,
  callback: HandlerCallback<Contract>,
  ...additionalArgs: never[]
) => Promise<ApiGatewayResult<Contract>>;
