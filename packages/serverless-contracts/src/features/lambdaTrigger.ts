import { getApiGatewayTrigger } from 'contracts/apiGateway/features';
import { getEventBridgeTrigger } from 'contracts/eventBridge/features';
import { ServerlessContract } from 'types';
import { GetTriggerArgs, GetTriggerReturn } from 'types/lambdaTrigger';

export const getTrigger = <Contract extends ServerlessContract>(
  ...[contract, additionalConfig]: GetTriggerArgs<Contract>
): GetTriggerReturn<Contract> => {
  switch (contract.contractType) {
    case 'apiGateway':
      // @ts-ignore inference is not good enough here, overriding
      return getApiGatewayTrigger(contract, additionalConfig);

    case 'eventBridge':
      // @ts-ignore inference is not good enough here, overriding
      return getEventBridgeTrigger(contract, additionalConfig);

    default:
      throw new Error('Not implemented');
  }
};
