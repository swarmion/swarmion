import { onDeploymentRequestedContract } from '@swarmion/orchestrator-contracts';
import { getTrigger } from '@swarmion/serverless-contracts';
import { getHandlerPath, LambdaFunction } from '@swarmion/serverless-helpers';

const config: LambdaFunction = {
  environment: {},
  handler: getHandlerPath(__dirname),
  iamRoleStatementsInherit: true,
  events: [getTrigger(onDeploymentRequestedContract, { eventBus: 'toto' })],
};

export default config;
