import { EventContract } from './eventContract';

export class EventBridgeEventContract extends EventContract {
  public busName: string;
  public source: string;
  public name: string;

  constructor(contract: EventContract, {busName, source, name}: { busName: string; source: string, name: string }) {
    super(contract);
    this.busName = busName;
    this.source = source;
    this.name = name;
  }
}
