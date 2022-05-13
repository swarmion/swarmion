import { AWS } from '@serverless/typescript';

import { ApiGatewayIntegrationType, ApiGatewayKey } from './index';

/**
 * map between our integration types (httpApi vs restApi) and
 * serverless's triggers
 */
export type ApiGatewayTriggerKey<
  ApiGatewayIntegration extends ApiGatewayIntegrationType,
> = ApiGatewayIntegration extends 'httpApi' ? 'httpApi' : 'http';

/**
 * The type of an httpApi lambda trigger
 */
export type ApiGatewayLambdaSimpleTriggerType<Key extends ApiGatewayKey> = {
  [key in Key]: {
    path: string;
    method: string;
  };
};

export type ApiGatewayLambdaCompleteTriggerType<Key extends ApiGatewayKey> = {
  [key in Key]: {
    path: string;
    method: string;
  } & ApiGatewayLambdaConfigType<Key>;
};

export type LambdaFunction = Exclude<AWS['functions'], undefined>[string];

/**
 * extract a type from an array of types.
 * See https://stackoverflow.com/questions/43537520/how-do-i-extract-a-type-from-an-array-in-typescript/52331580
 *
 **/
type Unpacked<T> = T extends (infer U)[] ? U : T;

type LambdaEvents = Unpacked<LambdaFunction['events']>;

/**
 * represent the lambda config type without path and method
 */
export type ApiGatewayLambdaConfigType<IntegrationType extends ApiGatewayKey> =
  Omit<
    Exclude<
      Extract<LambdaEvents, Record<IntegrationType, unknown>>[IntegrationType],
      string
    >,
    'path' | 'method'
  >;
