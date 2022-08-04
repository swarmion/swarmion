import { ApiGatewayContract } from '../apiGatewayContract';
import {
  ApiGatewayLambdaAdditionalConfigType,
  ApiGatewayLambdaCompleteTriggerType,
  ApiGatewayTriggerKey,
} from '../types';

/**
 * Returns a basic serverless function trigger associated to an ApiGatewayContract
 *
 * @argument contract your ApiGatewayContract
 * @argument additionalConfig for example an authorizer reference, ...
 */
export const getTrigger = <Contract extends ApiGatewayContract>(
  contract: Contract,
  additionalConfig: ApiGatewayLambdaAdditionalConfigType<
    ApiGatewayTriggerKey<Contract['integrationType']>,
    Contract['authorizerType']
  >,
): ApiGatewayLambdaCompleteTriggerType<
  ApiGatewayTriggerKey<Contract['integrationType']>,
  Contract['authorizerType']
> => {
  const key = contract.integrationType === 'httpApi' ? 'httpApi' : 'http';

  // @ts-ignore somehow the type inference does not work here
  return {
    [key]: {
      ...additionalConfig,
      path: contract.path,
      method: contract.method,
    },
  };
};
