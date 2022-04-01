import { JSONSchema } from 'json-schema-to-ts';

import { ContractOpenApiDocumentation } from './contractOpenApiDocumentation';

export interface GenericContract {
  fullContractSchema: JSONSchema;
  contractId: string;
  getopenApiDocumentation?(): ContractOpenApiDocumentation;
}
