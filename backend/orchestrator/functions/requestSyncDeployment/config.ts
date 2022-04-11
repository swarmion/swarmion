import { requestSyncDeployment } from '@swarmion/orchestrator-contracts';
import { getHandlerPath, LambdaFunction } from '@swarmion/serverless-helpers';

import { orchestratorPutDynamodbPolicies } from 'libs/config/dynamodb';

const config: LambdaFunction = {
  handler: getHandlerPath(__dirname),
  iamRoleStatements: [...orchestratorPutDynamodbPolicies],
  iamRoleStatementsInherit: true,
  events: [requestSyncDeployment.trigger],
};

export default config;
