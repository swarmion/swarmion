import { JSONSchema } from 'json-schema-to-ts';

import { StringOrNumberDictionaryJSONSchema } from 'types/constrainedJSONSchema';

/**
 * SQSContract:
 *
 * a contract used to define a type-safe interaction between AWS Services through SimpleQueueService (SQS).
 *
 * Main features:
 * - input and output dynamic validation with JSONSchemas on both end of the contract;
 * - type inference for both input and output;
 * - generation of a contract document that can be checked for breaking changes;
 * - simplify implementation of partial batch processing according to best practices
 * (see https://docs.aws.amazon.com/prescriptive-guidance/latest/lambda-event-filtering-partial-batch-responses-for-sqs/best-practices-partial-batch-responses.html).
 */
export class SQSContract<
  MessageBodySchema extends JSONSchema = JSONSchema,
  MessageAttributesSchema extends
    StringOrNumberDictionaryJSONSchema = StringOrNumberDictionaryJSONSchema,
> {
  public id: string;
  public contractType = 'SQS' as const;
  public messageBodySchema: MessageBodySchema;
  public messageAttributesSchema: MessageAttributesSchema;

  /**
   * Builds a new SQSContract contract
   */
  constructor({
    id,
    messageBodySchema,
    messageAttributesSchema,
  }: {
    /**
     * A unique id to identify the contract among stacks. Beware uniqueness!
     */
    id: string;
    /**
     * A JSONSchema used to validate the message body and infer its type.
     *
     * Please note that the `as const` directive is necessary to properly infer the type from the schema.
     * See https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
     */
    messageBodySchema: MessageBodySchema;
    /**
     * A JSONSchema used to validate the message attributes and infer its type.
     *
     * Please note that the `as const` directive is necessary to properly infer the type from the schema.
     * See https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
     */
    messageAttributesSchema?: MessageAttributesSchema;
  }) {
    this.id = id;
    this.messageBodySchema = messageBodySchema;
    this.messageAttributesSchema =
      messageAttributesSchema ?? ({} as MessageAttributesSchema);
  }
}
