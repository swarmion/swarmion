import { JSONSchema } from 'json-schema-to-ts';

import { getFullContractSchema as getApiGatewayFullContractSchema } from 'contracts/apiGateway/features';
import { getFullContractSchema as getCloudFormationFullContractSchema } from 'contracts/cloudFormation/features';
import { ServerlessContract } from 'index';

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
  }
};
