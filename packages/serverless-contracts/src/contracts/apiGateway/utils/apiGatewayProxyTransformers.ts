import { StatusCodes } from 'types/http';

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
    Body
  >;
};

export const handlerResponseToProxyResult = <
  IntegrationType extends ApiGatewayIntegrationType,
  Output,
>(
  statusCode: StatusCodes,
  body: unknown,
): ApiGatewayResult<IntegrationType, Output> => {
  return {
    statusCode,
    body: body !== undefined ? JSON.stringify(body) : '',
    headers:
      body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
  };
};
