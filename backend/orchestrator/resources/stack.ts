import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { OrchestratorDynamodb } from './dynamodb';

export class OrchestratorStack extends Stack {
  public dynamodbArn: string;
  public dynamodbName: string;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const { dynamodbArn, dynamodbName } = new OrchestratorDynamodb(
      this,
      'OrchestratorDynamodb',
    );

    this.dynamodbArn = dynamodbArn;
    this.dynamodbName = dynamodbName;
  }
}
