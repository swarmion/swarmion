import { JSONSchema } from 'json-schema-to-ts';

export class EventContract<S extends JSONSchema = JSONSchema> {
  public contractType = 'event' as const;
  public id: string;
  public payloadSchema: S;

  constructor(props: { id: string; payloadSchema: S }) {
    this.id = props.id;
    this.payloadSchema = props.payloadSchema;
  }
}
