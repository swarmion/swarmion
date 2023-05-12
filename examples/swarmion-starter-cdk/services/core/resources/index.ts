import { App } from 'aws-cdk-lib';

import {
  getAppStage,
  projectName,
  region,
} from '@swarmion-starter-cdk/cdk-configuration';

import { CoreStack } from './stack';

const app = new App();

const stage =
  (app.node.tryGetContext('stage') as keyof typeof sharedParams | undefined) ??
  defaultEnvironment;

new CoreStack(app, `${projectName}-core-${stage}`, {
  stage,
  env: { region },
});
