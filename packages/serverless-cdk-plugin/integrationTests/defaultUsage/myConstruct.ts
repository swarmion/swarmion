import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

import { ServerlessConstruct, ServerlessProps } from 'helper';

export class MyConstruct extends ServerlessConstruct {
  public dynamodbArn: string;
  public dynamodbName: string;
  public testServerlessConfigValue: string | undefined;

  constructor(scope: Construct, id: string, props: ServerlessProps) {
    super(scope, id, props);

    const { tableArn, tableName } = new Table(this, 'OrchestratorTable', {
      partitionKey: { name: 'PK', type: AttributeType.STRING },
      sortKey: { name: 'SK', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    this.dynamodbArn = tableArn;
    this.dynamodbName = tableName;
    this.testServerlessConfigValue =
      props.serverless.resources.Outputs?.testOutput.Description;
  }
}
