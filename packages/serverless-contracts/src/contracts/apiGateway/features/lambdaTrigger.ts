import { ApiGatewayContract } from '../apiGatewayContract';
import {
  ApiGatewayLambdaCompleteTriggerType,
  ApiGatewayLambdaConfigType,
  ApiGatewayLambdaSimpleTriggerType,
  ApiGatewayTriggerKey,
} from '../types';

/**
 * Returns a basic serverless function trigger associated to an ApiGatewayContract
 *
 * @param contract your ApiGatewayContract
 */
export const getTrigger = <Contract extends ApiGatewayContract>(
  contract: Contract,
): ApiGatewayLambdaSimpleTriggerType<
  ApiGatewayTriggerKey<Contract['integrationType']>
> => {
  const key = contract.integrationType === 'httpApi' ? 'httpApi' : 'http';

  // @ts-ignore somehow the type inference does not work here
  return { [key]: { path: contract.path, method: contract.method } };
};

/**
 * Returns an enhanced serverless function trigger associated to an ApiGatewayContract
 *
 * @param contract your ApiGatewayContract
 * @param additionalConfig for example an authorizer reference, ...
 */
export const getCompleteTrigger = <Contract extends ApiGatewayContract>(
  contract: Contract,
  additionalConfig: ApiGatewayLambdaConfigType<
    ApiGatewayTriggerKey<Contract['integrationType']>
  >,
): ApiGatewayLambdaCompleteTriggerType<
  ApiGatewayTriggerKey<Contract['integrationType']>
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
