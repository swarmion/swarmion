import { Fn } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path from 'path';

import {
  SCOPE_CONTEXT_NAME,
  TestEnvVar,
  TYPE_PATH_CONTEXT_NAME,
} from '@swarmion/integration-tests';
import ServerlessCdkPlugin, {
  ServerlessProps,
} from '@swarmion/serverless-cdk-plugin';

import { OrchestratorDynamodb } from './dynamodb';
import { OrchestratorEventBus } from './eventBridge';

export class OrchestratorStack extends ServerlessCdkPlugin.ServerlessStack {
  public dynamodbArn: string;
  public dynamodbName: string;
  public eventBusArn: string;
  public eventBusName: string;

  constructor(scope: Construct, id: string, serverlessProps: ServerlessProps) {
    scope.node.setContext(
      TYPE_PATH_CONTEXT_NAME,
      path.resolve('./testEnvVars.ts'),
    );
    scope.node.setContext(SCOPE_CONTEXT_NAME, 'orchestrator');
    super(scope, id, serverlessProps);

    const { dynamodb } = new OrchestratorDynamodb(this, 'OrchestratorDynamodb');

    const { eventBus } = new OrchestratorEventBus(this, 'OrchestratorEventBus');

    new TestEnvVar(this, 'API_URL', {
      value: Fn.getAtt('HttpApi', 'ApiEndpoint') as unknown as string, // Fn.getAtt will return some cloudformation which will resolved as a string ultimately
    });

    this.dynamodbArn = dynamodb.tableArn;
    this.dynamodbName = dynamodb.tableName;
    this.eventBusName = eventBus.eventBusName;
    this.eventBusArn = eventBus.eventBusArn;
  }
}

export const getCdkProperty =
  ServerlessCdkPlugin.getCdkPropertyHelper<OrchestratorStack>;
