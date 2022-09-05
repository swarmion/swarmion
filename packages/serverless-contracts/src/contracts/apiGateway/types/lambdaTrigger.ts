import { AWS } from '@serverless/typescript';
import { O } from 'ts-toolbelt';

import { CleanEmptyObject, Unpacked } from 'types/utilities';

import { ApiGatewayContract } from '../apiGatewayContract';
import {
  ApiGatewayAuthorizerType,
  ApiGatewayIntegrationType,
  ApiGatewayKey,
} from './common';

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
export type ApiGatewayLambdaCompleteTriggerType<
  Key extends ApiGatewayKey,
  AuthorizerType extends ApiGatewayAuthorizerType,
> = {
  [key in Key]: {
    path: string;
    method: string;
  } & ApiGatewayLambdaAdditionalConfigType<Key, AuthorizerType>;
};

/**
 * From @serverless/typescript, we get the type of a single lambda config
 */
export type LambdaFunction = Exclude<AWS['functions'], undefined>[string];

/**
 * Narrowing the type of a lambda config to the type of its events
 */
type LambdaEvents = Unpacked<LambdaFunction['events']>;

/**
 * basic additional config a user can define on an ApiGateway trigger.
 *
 * This doesn't include `path` and `method` as they are already defined in the contract itself.
 *
 * Also this does not take into account the authorizerType, do not use directly
 */
type ApiGatewayLambdaAdditionalConfigSimpleType<
  IntegrationType extends ApiGatewayKey,
> = Omit<
  Exclude<
    Extract<LambdaEvents, Record<IntegrationType, unknown>>[IntegrationType],
    string
  >,
  'path' | 'method'
>;

/**
 * represents additional config a user can define on an ApiGateway trigger.
 *
 * This doesn't include `path` and `method` as they are already defined in the contract itself.
 */
type ApiGatewayLambdaAdditionalConfigType<
  IntegrationType extends ApiGatewayKey,
  AuthorizerType extends ApiGatewayAuthorizerType,
> = AuthorizerType extends undefined
  ? CleanEmptyObject<
      O.Omit<
        ApiGatewayLambdaAdditionalConfigSimpleType<IntegrationType>,
        'authorizer'
      >
    >
  : O.Required<
      ApiGatewayLambdaAdditionalConfigSimpleType<IntegrationType>,
      'authorizer'
    >;

/**
 * the arguments array of the `getTrigger` function`
 *
 * the trick here is that when the contract is authenticated, the additional config
 * is required, whereas otherwise it is optional
 */
export type ApiGatewayTriggerArgs<Contract extends ApiGatewayContract> =
  Contract['authorizerType'] extends undefined
    ?
        | [
            Contract,
            ApiGatewayLambdaAdditionalConfigType<
              ApiGatewayTriggerKey<Contract['integrationType']>,
              Contract['authorizerType']
            >,
          ]
        | [Contract]
    : [
        Contract,
        ApiGatewayLambdaAdditionalConfigType<
          ApiGatewayTriggerKey<Contract['integrationType']>,
          Contract['authorizerType']
        >,
      ];
