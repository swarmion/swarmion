import { requestSyncDeployment } from '@swarmion/orchestrator-contracts';
import { getTrigger } from '@swarmion/serverless-contracts';
import { getHandlerPath, LambdaFunction } from '@swarmion/serverless-helpers';

import { getOrchestratorProperty } from 'resources/dynamodb';

const config: LambdaFunction = {
  environment: {
    ORCHESTRATOR_TABLE_NAME: getOrchestratorProperty('dynamodbName'),
  },
  handler: getHandlerPath(__dirname),
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Resource: getOrchestratorProperty('dynamodbArn'),
      Action: ['dynamodb:PutItem'],
    },
  ],
  iamRoleStatementsInherit: true,
  events: [getTrigger(requestSyncDeployment)],
};

export default config;
