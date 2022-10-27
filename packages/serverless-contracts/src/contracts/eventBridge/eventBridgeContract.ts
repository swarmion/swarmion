import { JSONSchema } from 'json-schema-to-ts';

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

  constructor({
    id,
    sources,
    eventType,
    payloadSchema,
  }: {
    id: string;
    sources: Sources;
    eventType: EventType;
    payloadSchema: PayloadSchema;
  }) {
    this.id = id;
    this.sources = sources;
    this.eventType = eventType;
    this.payloadSchema = payloadSchema;
  }
}
