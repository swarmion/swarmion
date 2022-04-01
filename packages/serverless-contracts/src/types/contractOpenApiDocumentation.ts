import { OpenAPIV3 } from 'openapi-types';

export interface ContractOpenApiDocumentation {
  path: string;
  method: string;
  documentation: OpenAPIV3.OperationObject;
}
