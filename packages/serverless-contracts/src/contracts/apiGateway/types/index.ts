import { HttpMethod } from 'types/http';

/**
 * The integration type: HTTP API or REST API
 * For more information, see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html
 */
export type ApiGatewayIntegrationType = 'httpApi' | 'restApi';
export type ApiGatewayKey = 'httpApi' | 'http';

/**
 * Computed request parameters. This enables the call to the contract to be type-safe
 */
export interface RequestParameters<BodyType> {
  method: HttpMethod;
  path: string;
  body?: BodyType;
  headers?: Record<string, string>;
  queryStringParameters?: Record<string, string>;
}

export * from './input';
export * from './common';
export * from './getRequestParameters';
export * from './fullContract';
export * from './handler';
export * from './lambdaTrigger';
