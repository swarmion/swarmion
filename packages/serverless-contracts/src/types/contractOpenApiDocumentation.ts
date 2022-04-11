import { OpenAPIV3 } from 'openapi-types';

import { GenericContract } from './genericContract';

export interface ContractOpenApiDocumentation {
  path: string;
  method: string;
  documentation: OpenAPIV3.OperationObject;
}

export interface DocumentedContract extends GenericContract {
  openApiDocumentation: ContractOpenApiDocumentation;
}

export const isInstanceOfDocumentedContract = (
  object: GenericContract,
): object is DocumentedContract => {
  return 'openApiDocumentation' in object;
};
