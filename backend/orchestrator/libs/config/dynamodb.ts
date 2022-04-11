import { cdkStack } from 'resources';

export const ORCHESTRATOR_TABLE_NAME = cdkStack.resolve(
  cdkStack.dynamodbName,
) as string;

export const orchestratorPutDynamodbPolicies = [
  {
    Effect: 'Allow',
    Resource: [cdkStack.resolve(cdkStack.dynamodbArn)],
    Action: ['dynamodb:PutItem'],
  },
];
