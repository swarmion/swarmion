import { FromSchema, JSONSchema } from 'json-schema-to-ts';

import { ConstrainedJSONSchema } from 'types/constrainedJSONSchema';

import { DefinedProperties } from './utils';

/**
 * Computed type of the input.
 */
export type InputType<
  PathParametersSchema extends ConstrainedJSONSchema | undefined,
  QueryStringParametersSchema extends ConstrainedJSONSchema | undefined,
  HeadersSchema extends ConstrainedJSONSchema | undefined,
  BodySchema extends JSONSchema | undefined,
> = DefinedProperties<{
  pathParameters: PathParametersSchema extends ConstrainedJSONSchema
    ? FromSchema<PathParametersSchema>
    : undefined;
  queryStringParameters: QueryStringParametersSchema extends ConstrainedJSONSchema
    ? FromSchema<QueryStringParametersSchema>
    : undefined;
  headers: HeadersSchema extends ConstrainedJSONSchema
    ? FromSchema<HeadersSchema>
    : undefined;
  body: BodySchema extends JSONSchema ? FromSchema<BodySchema> : undefined;
}>;
