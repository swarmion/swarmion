import { JSONSchema } from 'json-schema-to-ts';

export interface GenericContract {
  get fullContractSchema(): JSONSchema;
}
