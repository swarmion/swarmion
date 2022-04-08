import { JSONSchema } from 'json-schema-to-ts';

export interface GenericContract {
  fullContractSchema: JSONSchema;
  contractId: string;
}
