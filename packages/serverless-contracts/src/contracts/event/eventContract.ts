import { JSONSchema } from 'json-schema-to-ts';

export class EventContract<
  PayloadSchema extends JSONSchema | undefined = JSONSchema | undefined,
> {
  public contractType = 'event' as const;
  public id: string;
  public payloadSchema: PayloadSchema;

  constructor(props: { id: string; payloadSchema: PayloadSchema }) {
    this.id = props.id;
    this.payloadSchema = props.payloadSchema;
  }
}
