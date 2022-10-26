import { Construct } from 'constructs';

import ServerlessCdkPlugin, {
  ServerlessProps,
} from '@swarmion/serverless-cdk-plugin';

import { OrchestratorDynamodb } from './dynamodb';
import { OrchestratorEventBus } from './eventBridge';

export class OrchestratorService extends ServerlessCdkPlugin.ServerlessConstruct {
  public dynamodbArn: string;
  public dynamodbName: string;
  public eventBusArn: string;
  public eventBusName: string;

  constructor(scope: Construct, id: string, serverlessProps: ServerlessProps) {
    super(scope, id, serverlessProps);

    const { dynamodbName, dynamodbArn } = new OrchestratorDynamodb(
      this,
      'Table',
    );

    const { eventBusName, eventBusArn } = new OrchestratorEventBus(
      this,
      'EventBus',
    );

    this.dynamodbArn = dynamodbArn;
    this.dynamodbName = dynamodbName;
    this.eventBusName = eventBusName;
    this.eventBusArn = eventBusArn;
  }
}

export const getCdkProperty =
  ServerlessCdkPlugin.getCdkPropertyHelper<OrchestratorService>;
