import { App } from 'aws-cdk-lib';

import {
  defaultEnvironment,
  projectName,
  region,
  sharedParams,
} from '@swarmion-starter-cdk/serverless-configuration';

import { CoreStack } from './stack';

const app = new App();

const stage =
  (app.node.tryGetContext('stage') as keyof typeof sharedParams | undefined) ??
  defaultEnvironment;

new CoreStack(app, `${projectName}-core-${stage}`, {
  stage,
  env: { region },
});
