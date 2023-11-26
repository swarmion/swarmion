import { App } from 'aws-cdk-lib';

import { FrontendStack } from './stack';
import { getAppStage } from './utils/getAppStage';

const projectName = 'swarmion-doc';
const region = 'eu-west-3';

const app = new App();

const stage = getAppStage(app);

new FrontendStack(app, `${projectName}-${stage}`, {
  env: { region },
});
