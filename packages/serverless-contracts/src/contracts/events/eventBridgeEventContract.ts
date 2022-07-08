import { JSONSchema } from 'json-schema-to-ts';

import { EventContract } from './eventContract';

export class EventBridgeEventContract<
  S extends JSONSchema = JSONSchema,
> extends EventContract<S> {
  public busName: string;
  public source: string;
  public name: string;

  constructor(
    contract: EventContract<S>,
    {
      busName,
      source,
      name,
    }: { busName: string; source: string; name: string },
  ) {
    super(contract);
    this.busName = busName;
    this.source = source;
    this.name = name;
  }
}
