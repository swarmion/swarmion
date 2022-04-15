import { AWS } from '@serverless/typescript';
import type { Lift } from 'serverless-lift';

import {
  frameworkVersion,
  projectName,
  sharedParams,
  sharedProviderConfig,
} from '@swarmion/serverless-configuration';

const serverlessConfiguration: AWS & Lift = {
  service: `${projectName}-documentation`, // Keep it short to have role name below 64
  frameworkVersion,
  plugins: ['serverless-lift'],
  provider: sharedProviderConfig,
  params: sharedParams,
  custom: {
    projectName,
  },
  constructs: {
    app: {
      type: 'single-page-app',
      path: '../documentation/build',
    },
  },
  resources: {
    Description: 'Documentation cloudfront service',
  },
};

module.exports = serverlessConfiguration;
