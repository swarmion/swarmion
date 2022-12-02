import * as cdk from 'aws-cdk-lib';

import { AmplifyStack } from './stack';

const app = new cdk.App();

const CLOUDFORMATION_STACK_NAME = 'AmplifyStackSwarmion';

new AmplifyStack(app, CLOUDFORMATION_STACK_NAME, {
  analyticsReporting: true,
  description: 'My Swarmion NextJS APP deployed with Amplify',
});
