import { JSONSchema } from 'json-schema-to-ts';

export class EventBridgeContract<
  PayloadSchema extends JSONSchema = JSONSchema,
> {
  public id: string;
  public source: string;
  public eventType: string;
  private payloadSchema: PayloadSchema;

  constructor({
    id,
    source,
    eventType,
    payloadSchema,
  }: {
    id: string;
    source: string;
    eventType: string;
    payloadSchema: PayloadSchema;
  }) {
    this.id = id;
    this.source = source;
    this.eventType = eventType;
    this.payloadSchema = payloadSchema;
  }
}
