import { OpenAPIV3 } from 'openapi-types';

import { getOpenApiDocumentation as getApiGatewayOpenApiDocumentation } from 'contracts/apiGateway/features';
import { ServerlessContract } from 'types/serverlessContract';

export interface ContractOpenApiDocumentation {
  path: string;
  method: string;
  documentation: OpenAPIV3.OperationObject;
}

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
