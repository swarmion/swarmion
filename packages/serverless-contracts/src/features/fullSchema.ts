import { JSONSchema } from 'json-schema-to-ts';

import { ApiGatewayContract } from 'contracts/apiGateway';
import { getFullContractSchema as getApiGatewayFullContractSchema } from 'contracts/apiGateway/features';
import { CloudFormationContract } from 'contracts/cloudFormation';
import { getFullContractSchema as getCloudFormationFullContractSchema } from 'contracts/cloudFormation/features';
import { ServerlessContract } from 'index';

export const getContractFullSchema = (
  contract: ServerlessContract,
): JSONSchema | undefined => {
  switch (contract.contractType) {
    case 'apiGateway': {
      return getApiGatewayFullContractSchema(
        contract as ApiGatewayContract,
      ) as JSONSchema;
    }
    case 'cloudFormation': {
      return getCloudFormationFullContractSchema(
        contract as CloudFormationContract,
      );
    }
    default: {
      return undefined;
    }
  }
};
