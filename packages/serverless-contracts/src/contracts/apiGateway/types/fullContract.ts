import { StatusCodes } from 'http-status-codes';
import { JSONSchema } from 'json-schema-to-ts';

import { DefinedProperties } from './utils';

/**
 * The intermediary type used to determine the contract type of the lambda.
 *
 * Each schema property is possibly undefined (no schema) or is a JSONSchema.
 * Do not use this type directly, use it with `DefinedProperties`
 */
type AllFullContractProperties<
  Path,
  Method,
  IntegrationType,
  PathParametersSchema extends JSONSchema | undefined,
  QueryStringParametersSchema extends JSONSchema | undefined,
  HeadersSchema extends JSONSchema | undefined,
  BodySchema extends JSONSchema | undefined,
  OutputSchema extends Partial<Record<StatusCodes, JSONSchema>> = {
    [StatusCodes.OK]: JSONSchema | undefined;
  },
> = {
  contractId: { const: string };
  contractType: { const: IntegrationType };
  path: { const: Path };
  method: { const: Method };
  pathParameters: PathParametersSchema;
  queryStringParameters: QueryStringParametersSchema;
  headers: HeadersSchema;
  body: BodySchema;
  output: OutputSchema;
};

/**
 * Computed schema type of the input validation schema.
 *
 * Can be used with `FromSchema` to infer the type of the contract of the lambda
 */
export interface FullContractSchemaType<
  Path,
  Method,
  IntegrationType,
  PathParametersSchema extends JSONSchema | undefined,
  QueryStringParametersSchema extends JSONSchema | undefined,
  HeadersSchema extends JSONSchema | undefined,
  BodySchema extends JSONSchema | undefined,
  OutputSchema extends Partial<Record<StatusCodes, JSONSchema>> = {
    [StatusCodes.OK]: JSONSchema | undefined;
  },
  DefinedFullContractProperties = DefinedProperties<
    AllFullContractProperties<
      Path,
      Method,
      IntegrationType,
      PathParametersSchema,
      QueryStringParametersSchema,
      HeadersSchema,
      BodySchema,
      OutputSchema
    >
  >,
> {
  type: 'object';
  properties: DefinedFullContractProperties;
  required: Array<keyof DefinedFullContractProperties>;
  additionalProperties: false;
  [key: string]: unknown;
}
