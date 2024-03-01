/*eslint-disable complexity*/

import type { JSONSchema } from 'json-schema-to-ts';
import cloneDeep from 'lodash/cloneDeep.js';
import mapValues from 'lodash/mapValues.js';
import { OpenAPIV3 } from 'openapi-types';

const isArrayOfString = (array: unknown): array is string[] =>
  Array.isArray(array) && array.every(element => typeof element === 'string');

const convertNullableSchema = (schema: OpenAPIV3.SchemaObject): void => {
  // eslint-disable-next-line
  if (schema.type?.includes('null')) {
    if (isArrayOfString(schema.type)) {
      const filteredSchemaType = schema.type.filter(type => type !== 'null');
      // eslint-disable-next-line
      if (filteredSchemaType && filteredSchemaType.length === 1) {
        // @ts-expect-error problem with recursively typing, fully unit tested
        schema.type = filteredSchemaType[0];
      }
    } else {
      delete schema.type;
    }
    schema.nullable = true;
  }
};

const convertArraySchemaPropertiesToValidOAS3 = (
  schema: JSONSchema | OpenAPIV3.SchemaObject,
): void => {
  // @ts-expect-error problem with recursively typing, fully unit tested
  // eslint-disable-next-line
  if (schema.items) {
    // @ts-expect-error problem with recursively typing, fully unit tested
    if (Array.isArray(schema.items)) {
      // @ts-expect-error problem with recursively typing, fully unit tested
      // eslint-disable-next-line
      schema.items = schema.items.map(convertJsonSchemaToValidOAS3);
    } else {
      // @ts-expect-error problem with recursively typing, fully unit tested
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      schema.items = convertJsonSchemaToValidOAS3(schema.items);
    }
  }
};

const convertObjectSchemaPropertiesToValidOAS3 = (
  schema: OpenAPIV3.SchemaObject,
): void => {
  // eslint-disable-next-line
  if (schema.properties) {
    // @ts-expect-error problem with recursively typing, fully unit tested
    schema.properties = mapValues(
      schema.properties,
      convertJsonSchemaToValidOAS3,
    );
  }
  // eslint-disable-next-line
  if (schema.additionalProperties) {
    schema.additionalProperties = convertJsonSchemaToValidOAS3(
      // @ts-expect-error problem with recursively typing, fully unit tested
      schema.additionalProperties,
    );
  }
  // @ts-expect-error problem with recursively typing, fully unit tested
  // eslint-disable-next-line
  if (schema.patternProperties) {
    // @ts-expect-error problem with recursively typing, fully unit tested
    // eslint-disable-next-line
    schema.patternProperties = mapValues(
      // @ts-expect-error problem with recursively typing, fully unit tested
      schema.patternProperties,
      convertJsonSchemaToValidOAS3,
    );
  }
};

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export const convertJsonSchemaToValidOAS3 = <S extends boolean | JSONSchema>(
  initialSchema: S,
): S extends JSONSchema | OpenAPIV3.SchemaObject
  ? OpenAPIV3.SchemaObject
  : OpenAPIV3.SchemaObject | boolean => {
  if (typeof initialSchema === 'boolean') {
    return initialSchema as unknown as OpenAPIV3.SchemaObject;
  }

  const schema = cloneDeep(initialSchema) as OpenAPIV3.SchemaObject;

  // @ts-expect-error problem with recursively typing, fully unit tested
  // eslint-disable-next-line
  if (schema.examples && schema.examples[0] !== undefined) {
    // @ts-expect-error problem with recursively typing, fully unit tested
    // eslint-disable-next-line
    schema.example = schema.examples[0];
  }
  // @ts-expect-error problem with recursively typing, fully unit tested
  delete schema.examples;

  // @ts-expect-error problem with recursively typing, fully unit tested
  // eslint-disable-next-line
  if (schema.const) {
    // @ts-expect-error problem with recursively typing, fully unit tested
    schema.enum = [schema.const];
    // @ts-expect-error problem with recursively typing, fully unit tested
    delete schema.const;
  }

  convertNullableSchema(schema);

  convertArraySchemaPropertiesToValidOAS3(schema);

  convertObjectSchemaPropertiesToValidOAS3(schema);

  // eslint-disable-next-line
  if (schema.anyOf) {
    // @ts-expect-error problem with recursively typing, fully unit tested
    // eslint-disable-next-line
    schema.anyOf = schema.anyOf.map(convertJsonSchemaToValidOAS3);
  }

  // eslint-disable-next-line
  if (schema.oneOf) {
    // @ts-expect-error problem with recursively typing, fully unit tested
    // eslint-disable-next-line
    schema.oneOf = schema.oneOf.map(convertJsonSchemaToValidOAS3);
  }

  // eslint-disable-next-line
  if (schema.allOf) {
    // @ts-expect-error problem with recursively typing, fully unit tested
    // eslint-disable-next-line
    schema.allOf = schema.allOf.map(convertJsonSchemaToValidOAS3);
  }

  // eslint-disable-next-line
  if (schema.not) {
    // @ts-expect-error problem with recursively typing, fully unit tested
    schema.not = convertJsonSchemaToValidOAS3(schema.not);
  }

  // @ts-expect-error problem with recursively typing, fully unit tested
  // eslint-disable-next-line
  if (schema.definitions) {
    // @ts-expect-error problem with recursively typing, fully unit tested
    // eslint-disable-next-line
    schema.definitions = mapValues(
      // @ts-expect-error problem with recursively typing, fully unit tested
      schema.definitions,
      convertJsonSchemaToValidOAS3,
    );
  }

  return schema;
};
