import { OpenAPIV3 } from 'openapi-types';

import { getContractDocumentation as getApiGatewayContractDocumentation } from 'contracts/apiGateway/features';
import { ServerlessContract } from 'types/serverlessContract';
import { isDefined } from 'utils';

export interface ContractOpenApiDocumentation {
  path: string;
  method: string;
  documentation: OpenAPIV3.OperationObject;
}

export const getOpenApiDocumentation = ({
  title,
  description,
  contracts,
}: {
  title: string;
  description?: string;
  contracts: ServerlessContract[];
}): OpenAPIV3.Document => {
  const contractDocumentations = contracts
    .map(contract => getContractOpenApiDocumentation(contract))
    .filter(isDefined);

  const paths: OpenAPIV3.PathsObject =
    contractDocumentations.reduce<OpenAPIV3.PathsObject>(
      (pathsObject, pathDocumentation) => {
        pathsObject[pathDocumentation.path] = {
          [pathDocumentation.method]: pathDocumentation.documentation,
        };

        return pathsObject;
      },
      {},
    );

  const openApiDocumentation: OpenAPIV3.Document = {
    openapi: '3.0.1',
    info: {
      title,
      description,
      version: new Date().toISOString(),
    },
    paths,
  };

  return openApiDocumentation;
};

const getContractOpenApiDocumentation = (
  contract: ServerlessContract,
): ContractOpenApiDocumentation | undefined => {
  switch (contract.contractType) {
    case 'apiGateway': {
      return getApiGatewayContractDocumentation(contract);
    }
    default: {
      return undefined;
    }
  }
};
