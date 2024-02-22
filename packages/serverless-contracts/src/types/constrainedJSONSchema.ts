interface StringDictionaryJSONSchemaProperty {
  readonly type?: 'string';
  readonly const?: string;
  readonly enum?: readonly string[];
  readonly [key: string]: unknown;
}

/**
 * A simplified version of the JSONSchema definition in order to constrain some definitions
 * to only contain string attributes. This is especially useful for path parameters, headers
 * and query parameters that will be stringified anyway.
 */
export interface StringDictionaryJSONSchema {
  readonly type: 'object';
  readonly additionalProperties?: boolean;
  readonly properties?: {
    readonly [key: string]: StringDictionaryJSONSchemaProperty;
  };
  readonly required?: readonly string[];
  readonly [key: string]: unknown;
  readonly oneOf?: readonly StringDictionaryJSONSchema[];
  readonly anyOf?: readonly StringDictionaryJSONSchema[];
  readonly allOf?: readonly StringDictionaryJSONSchema[];
}
