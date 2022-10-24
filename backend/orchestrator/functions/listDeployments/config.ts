import { listDeploymentsContract } from '@swarmion/orchestrator-contracts';
import { getTrigger } from '@swarmion/serverless-contracts';
import { getHandlerPath, LambdaFunction } from '@swarmion/serverless-helpers';

import { getCdkProperty } from 'resources/dynamodb';

const config: LambdaFunction = {
  environment: {
    ORCHESTRATOR_TABLE_NAME: getCdkProperty('dynamodbName'),
  },
  handler: getHandlerPath(__dirname),
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Resource: getCdkProperty('dynamodbArn'),
      Action: ['dynamodb:Query'],
    },
  ],
  iamRoleStatementsInherit: true,
  events: [getTrigger(listDeploymentsContract)],
};

export default config;
