import { EventBus } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';

export class OrchestratorEventBus extends Construct {
  public eventBusArn: string;
  public eventBusName: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const eventBus = new EventBus(this, 'OrchestratorTable');

    this.eventBusName = eventBus.eventBusName;
    this.eventBusArn = eventBus.eventBusArn;
  }
}
