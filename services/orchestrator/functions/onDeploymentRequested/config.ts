import {
  onDeploymentRequestedContract,
  onDeploymentUpdatedContract,
} from '@swarmion/orchestrator-contracts';
import { getTrigger } from '@swarmion/serverless-contracts';
import { getHandlerPath, LambdaFunction } from '@swarmion/serverless-helpers';

import { getCdkProperty } from 'resources';

const config: LambdaFunction = {
  environment: {},
  handler: getHandlerPath(__dirname),
  iamRoleStatementsInherit: true,
  events: [
    getTrigger(onDeploymentRequestedContract, {
      eventBus: getCdkProperty('eventBusName'),
    }),
    getTrigger(onDeploymentUpdatedContract, {
      eventBus: getCdkProperty('eventBusName'),
    }),
  ],
};

export default config;
