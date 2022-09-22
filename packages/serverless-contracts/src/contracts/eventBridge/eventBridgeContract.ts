export class EventBridgeContract {
  public source: string;
  public name: string;

  constructor({ source, name }: { source: string; name: string }) {
    this.source = source;
    this.name = name;
  }
}
