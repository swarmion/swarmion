import { CloudFormationContract } from '@swarmion/serverless-contracts';

import { projectName } from '@swarmion-starter/serverless-configuration';

export const httpApiResourceContract = new CloudFormationContract({
  id: 'core-httpApi',
  name: `CoreHttpApi-${projectName}`,
});
