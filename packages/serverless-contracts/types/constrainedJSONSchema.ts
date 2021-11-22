interface ConstrainedJSONSchemaProperty {
  readonly type?: 'string';
  readonly const?: string;
  readonly enum?: readonly string[];
}

/**
 * A simplified version of the JSONSchema definition in order to constrain some definitions
 * to only contain string attributes. This is especially useful for path parameters, headers
 * and query parameters that will be stringified anyway.
 */
export interface ConstrainedJSONSchema {
  readonly type: 'object';
  readonly additionalProperties?: boolean;
  readonly properties?: {
    readonly [key: string]: ConstrainedJSONSchemaProperty;
  };
  readonly required?: readonly string[];
}
