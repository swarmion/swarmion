import { CloudFormationContract } from '@swarmion/serverless-contracts';

import { projectName } from '@swarmion-with-next/serverless-configuration';

export const httpApiResourceContract = new CloudFormationContract({
  id: 'core-httpApi',
  name: `CoreHttpApi-${projectName}`,
});
