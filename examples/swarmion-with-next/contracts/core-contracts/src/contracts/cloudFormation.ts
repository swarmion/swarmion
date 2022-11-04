import { CloudFormationContract } from '@swarmion/serverless-contracts';

export const httpApiResourceContract = new CloudFormationContract({
  id: 'core-httpApi',
  name: 'CoreHttpApi',
});
