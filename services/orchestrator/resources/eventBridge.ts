import { EventBus } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';

import { TestEnvVar } from '@swarmion/integration-tests';

export class OrchestratorEventBus extends Construct {
  public eventBus: EventBus;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.eventBus = new EventBus(this, 'EventBus');

    new TestEnvVar(this, 'EVENT_BUS_NAME', {
      value: this.eventBus.eventBusName,
    });
  }
}
