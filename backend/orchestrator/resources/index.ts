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

    const { dynamodb } = new OrchestratorDynamodb(this, 'Table');

    const { eventBus } = new OrchestratorEventBus(this, 'EventBus');

    this.dynamodbArn = dynamodb.tableArn;
    this.dynamodbName = dynamodb.tableName;
    this.eventBusName = eventBus.eventBusName;
    this.eventBusArn = eventBus.eventBusArn;
  }
}

export const getCdkProperty =
  ServerlessCdkPlugin.getCdkPropertyHelper<OrchestratorService>;
