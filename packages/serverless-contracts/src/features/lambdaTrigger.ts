import { getApiGatewayTrigger, getEventBridgeTrigger } from 'contracts';
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

    case 'cloudFormation':
      throw new Error('EventBridge contract has no trigger');

    default:
      // exhaustiveness check
      // eslint-disable-next-line no-case-declarations
      const _neverContract: never = contract;
      console.error('Not implemented for contract', _neverContract);
      throw new Error('Not implemented');
  }
};
