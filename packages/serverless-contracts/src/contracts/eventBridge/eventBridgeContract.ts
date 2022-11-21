import { JSONSchema } from 'json-schema-to-ts';

/**
 * EventBridgeContract:
 *
 * a contract used to define a type-safe interaction between AWS Services through EventBridge.
 *
 * Main features:
 * - input and output dynamic validation with JSONSchemas on both end of the contract;
 * - type inference for both input and output;
 * - generation of a contract document that can be checked for breaking changes;
 */
export class EventBridgeContract<
  Sources extends readonly string[] = readonly string[],
  EventType extends string = string,
  PayloadSchema extends JSONSchema = JSONSchema,
> {
  public id: string;
  public contractType = 'eventBridge' as const;
  public sources: Sources;
  public eventType: EventType;
  public payloadSchema: PayloadSchema;

  /**
   * Builds a new EventBridgeContract contract
   */
  constructor({
    id,
    sources,
    eventType,
    payloadSchema,
  }: {
    /**
     * A unique id to identify the contract among stacks. Beware uniqueness!
     */
    id: string;
    /**
     * The sources of the event.
     *
     * Please note that the `as const` directive is necessary to properly infer the type from the schema.
     * See https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
     *
     * @type string[]
     */
    sources: Sources;
    /**
     * The event type.
     *
     * @type string
     */
    eventType: EventType;
    /**
     * A JSONSchema used to validate the payload and infer its type.
     *
     * Please note that the `as const` directive is necessary to properly infer the type from the schema.
     * See https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
     *
     * Also please note that for Typescript reasons, you need to explicitly pass `undefined` if you don't want to use the schema.
     */
    payloadSchema: PayloadSchema;
  }) {
    this.id = id;
    this.sources = sources;
    this.eventType = eventType;
    this.payloadSchema = payloadSchema;
  }
}
