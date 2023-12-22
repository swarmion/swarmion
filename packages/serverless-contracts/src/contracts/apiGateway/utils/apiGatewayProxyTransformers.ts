import { HttpStatusCodes } from 'types/http';

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
>({
  statusCode,
  headers,
  body,
}: {
  statusCode: string | number | symbol;
  headers?: Record<string, string>;
  body: unknown;
}): ApiGatewayResult<IntegrationType, Output> => {
  const contentTypeHeader =
    body !== undefined ? { 'Content-Type': 'application/json' } : undefined;

  return {
    statusCode: statusCode as HttpStatusCodes,
    body: body !== undefined ? JSON.stringify(body) : '',
    headers: {
      ...contentTypeHeader,
      ...headers,
    },
  };
};
