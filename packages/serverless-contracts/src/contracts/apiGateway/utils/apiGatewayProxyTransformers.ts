import { ApiGatewayEvent, ApiGatewayResult, HandlerEventType } from '../types';
import {
  ApiGatewayAuthorizerType,
  ApiGatewayIntegrationType,
} from '../types/constants';

export const proxyEventToHandlerEvent = <
  IntegrationType extends ApiGatewayIntegrationType,
  AuthorizerType extends ApiGatewayAuthorizerType,
  PathParameters,
  QueryStringParameters,
  Headers,
  CustomRequestContext,
  Body,
>({
  requestContext,
  body: proxyEventBody = null,
  headers,
  pathParameters,
  queryStringParameters,
}: ApiGatewayEvent<IntegrationType, AuthorizerType>): HandlerEventType<
  IntegrationType,
  AuthorizerType,
  PathParameters,
  QueryStringParameters,
  Headers,
  CustomRequestContext,
  Body
> => {
  return {
    requestContext,
    body: (proxyEventBody !== null
      ? JSON.parse(proxyEventBody)
      : undefined) as Body,
    headers,
    pathParameters,
    queryStringParameters: queryStringParameters ?? {},
  } as unknown as HandlerEventType<
    IntegrationType,
    AuthorizerType,
    PathParameters,
    QueryStringParameters,
    Headers,
    CustomRequestContext,
    Body
  >;
};

export const handlerResponseToProxyResult = <
  IntegrationType extends ApiGatewayIntegrationType,
  Output,
>(
  handlerResponse: Output,
): ApiGatewayResult<IntegrationType, Output> => ({
  statusCode: 200,
  body: handlerResponse !== undefined ? JSON.stringify(handlerResponse) : '',
  headers:
    handlerResponse !== undefined
      ? { 'Content-Type': 'application/json' }
      : undefined,
});
