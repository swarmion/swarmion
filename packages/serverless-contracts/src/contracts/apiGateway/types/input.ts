import { JSONSchema } from 'json-schema-to-ts';

import { DefinedProperties } from './utils';

/**
 * The intermediary type used to determine the input type of the lambda.
 *
 * Each property is either undefined (no schema) or is a JSONSchema.
 * Do not use this type directly, use it with `DefinedProperties`
 */
export type AllInputProperties<
  PathParametersSchema extends JSONSchema | undefined,
  QueryStringParametersSchema extends JSONSchema | undefined,
  HeadersSchema extends JSONSchema | undefined,
  BodySchema extends JSONSchema | undefined,
> = {
  pathParameters: PathParametersSchema;
  queryStringParameters: QueryStringParametersSchema;
  headers: HeadersSchema;
  body: BodySchema;
};

/**
 * Computed schema type of the input validation schema.
 *
 * Can be used with `FromSchema` to infer the type of the input event of the lambda
 */
export type InputSchemaType<
  PathParametersSchema extends JSONSchema | undefined,
  QueryStringParametersSchema extends JSONSchema | undefined,
  HeadersSchema extends JSONSchema | undefined,
  BodySchema extends JSONSchema | undefined,
  AllowAdditionalProperties extends boolean,
  DefinedInputProperties = DefinedProperties<
    AllInputProperties<
      PathParametersSchema,
      QueryStringParametersSchema,
      HeadersSchema,
      BodySchema
    >
  >,
> = {
  type: 'object';
  properties: DefinedInputProperties;
  required: Array<keyof DefinedInputProperties>;
  additionalProperties: AllowAdditionalProperties;
};
