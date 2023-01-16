import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

import { PARTITION_KEY, SORT_KEY } from 'sharedConstants';

export class OrchestratorDynamodb extends Construct {
  public dynamodb: Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.dynamodb = new Table(this, 'Table', {
      partitionKey: { name: PARTITION_KEY, type: AttributeType.STRING },
      sortKey: { name: SORT_KEY, type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
  }
}
