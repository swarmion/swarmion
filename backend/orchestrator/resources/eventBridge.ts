import { EventBus } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';

export class OrchestratorEventBus extends Construct {
  public eventBus: EventBus;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.eventBus = new EventBus(this, 'EventBus');
  }
}
