import { App } from 'aws-cdk-lib';
import dotenv from 'dotenv';

import {
  defaultEnvironment,
  region,
  sharedParams,
} from '@swarmion-with-cdk/serverless-configuration';

import { CoreStack } from './stack';

dotenv.config();

const app = new App();

const stage =
  (app.node.tryGetContext('stage') as keyof typeof sharedParams | undefined) ??
  defaultEnvironment;

new CoreStack(app, `backend-core-${stage}`, {
  env: { region },
  stage,
});
