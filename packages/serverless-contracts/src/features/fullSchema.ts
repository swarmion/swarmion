import { JSONSchema } from 'json-schema-to-ts';

import { getFullContractSchema as getSQSFullContractSchema } from 'contracts/SQS/features';
import { getFullContractSchema as getApiGatewayFullContractSchema } from 'contracts/apiGateway/features';
import { getFullContractSchema as getCloudFormationFullContractSchema } from 'contracts/cloudFormation/features';
import { getFullContractSchema as getEventBridgeFullContractSchema } from 'contracts/eventBridge/features';

import { ServerlessContract } from '../types';

export const getContractFullSchema = (
  contract: ServerlessContract,
): JSONSchema => {
  switch (contract.contractType) {
    case 'apiGateway': {
      // @ts-expect-error FIXME: problem with types here
      return getApiGatewayFullContractSchema(contract);
    }
    case 'cloudFormation': {
      return getCloudFormationFullContractSchema(contract);
    }
    case 'eventBridge': {
      return getEventBridgeFullContractSchema(contract);
    }
    case 'SQS': {
      return getSQSFullContractSchema(contract);
    }
  }
};
