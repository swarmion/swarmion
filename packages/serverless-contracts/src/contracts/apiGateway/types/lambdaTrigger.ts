import { O } from 'ts-toolbelt';

import { LambdaEvents } from 'types/lambdaEvents';
import { CleanEmptyObject } from 'types/utilities';

import { ApiGatewayContract } from '../apiGatewayContract';
import {
  ApiGatewayAuthorizerType,
  ApiGatewayIntegrationType,
  ApiGatewayKey,
} from './constants';

/**
 * map between our integration types (httpApi vs restApi) and
 * serverless's triggers
 */
type ApiGatewayTriggerKey<
  ApiGatewayIntegration extends ApiGatewayIntegrationType,
> = ApiGatewayIntegration extends 'httpApi' ? 'httpApi' : 'http';

/**
 * The type of an httpApi lambda trigger
 */
export type ApiGatewayLambdaCompleteTriggerType<
  Contract extends ApiGatewayContract,
> = {
  [key in ApiGatewayTriggerKey<Contract['integrationType']>]: {
    path: string;
    method: string;
  } & ApiGatewayLambdaAdditionalConfigType<
    ApiGatewayTriggerKey<Contract['integrationType']>,
    Contract['authorizerType']
  >;
};

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
 * the arguments array of the `getTrigger` function`, except the contract itself
 *
 * the trick here is that when the contract is authenticated, the additional config
 * is required, whereas otherwise it is optional
 */
export type ApiGatewayTriggerArgs<Contract extends ApiGatewayContract> =
  Contract['authorizerType'] extends undefined
    ?
        | [
            ApiGatewayLambdaAdditionalConfigType<
              ApiGatewayTriggerKey<Contract['integrationType']>,
              Contract['authorizerType']
            >,
          ]
        | []
    : [
        ApiGatewayLambdaAdditionalConfigType<
          ApiGatewayTriggerKey<Contract['integrationType']>,
          Contract['authorizerType']
        >,
      ];
