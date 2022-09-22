import { JSONSchema } from 'json-schema-to-ts';

export class EventBridgeContract<
  Source extends string = string,
  EventType extends string = string,
  PayloadSchema extends JSONSchema = JSONSchema,
> {
  public id: string;
  public contractType = 'eventBridge' as const;
  public source: Source;
  public eventType: EventType;
  public payloadSchema: PayloadSchema;

  constructor({
    id,
    source,
    eventType,
    payloadSchema,
  }: {
    id: string;
    source: Source;
    eventType: EventType;
    payloadSchema: PayloadSchema;
  }) {
    this.id = id;
    this.source = source;
    this.eventType = eventType;
    this.payloadSchema = payloadSchema;
  }
}
