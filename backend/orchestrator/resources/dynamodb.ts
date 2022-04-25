import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export const PARTITION_KEY = 'pk';
export const SORT_KEY = 'sk';

export class OrchestratorDynamodb extends Construct {
  public dynamodbArn: string;
  public dynamodbName: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const table = new Table(this, 'OrchestratorTable', {
      partitionKey: { name: PARTITION_KEY, type: AttributeType.STRING },
      sortKey: { name: SORT_KEY, type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    this.dynamodbArn = table.tableArn;
    this.dynamodbName = table.tableName;
  }
}
