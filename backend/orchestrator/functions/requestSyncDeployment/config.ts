import { requestSyncDeploymentContract } from '@swarmion/orchestrator-contracts';
import { getTrigger } from '@swarmion/serverless-contracts';
import { getHandlerPath, LambdaFunction } from '@swarmion/serverless-helpers';

import { getCdkProperty } from 'resources';

const config: LambdaFunction = {
  environment: {
    ORCHESTRATOR_TABLE_NAME: getCdkProperty('dynamodbName'),
    EVENT_BUS_NAME: getCdkProperty('eventBusName'),
  },
  handler: getHandlerPath(__dirname),
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Resource: getCdkProperty('dynamodbArn'),
      Action: ['dynamodb:PutItem'],
    },
    {
      Effect: 'Allow',
      Resource: getCdkProperty('eventBusArn'),
      Action: ['events:PutEvents'],
    },
  ],
  iamRoleStatementsInherit: true,
  events: [getTrigger(requestSyncDeploymentContract)],
};

export default config;
