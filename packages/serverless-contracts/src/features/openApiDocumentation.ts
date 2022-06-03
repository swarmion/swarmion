import { getOpenApiDocumentation as getApiGatewayOpenApiDocumentation } from 'contracts/apiGateway/features';
import { ContractOpenApiDocumentation, ServerlessContract } from 'types';

export const getOpenApiDocumentation = (
  contract: ServerlessContract,
): ContractOpenApiDocumentation | undefined => {
  switch (contract.contractType) {
    case 'apiGateway': {
      return getApiGatewayOpenApiDocumentation(contract);
    }
    default: {
      return undefined;
    }
  }
};
