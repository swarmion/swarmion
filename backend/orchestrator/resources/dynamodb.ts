export const PARTITION_KEY = 'pk';
export const SORT_KEY = 'sk';

export const DeploymentTable = {
  Type: 'AWS::DynamoDB::Table',
  Properties: {
    AttributeDefinitions: [
      { AttributeName: PARTITION_KEY, AttributeType: 'S' },
      { AttributeName: SORT_KEY, AttributeType: 'S' },
    ],
    KeySchema: [
      {
        KeyType: 'HASH',
        AttributeName: PARTITION_KEY,
      },
      {
        KeyType: 'RANGE',
        AttributeName: SORT_KEY,
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
};
