import { CloudFormationContract } from '@swarmion/serverless-contracts';

import { projectName } from '@swarmion-full-stack/serverless-configuration';

export const httpApiResourceContract = new CloudFormationContract({
  id: 'core-httpApi',
  name: `CoreHttpApi-${projectName}`,
});
