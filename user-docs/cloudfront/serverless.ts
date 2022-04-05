import { AWS } from '@serverless/typescript';
import type { Lift } from 'serverless-lift';

import {
  projectName,
  sharedParams,
  sharedProviderConfig,
} from '@swarmion/serverless-configuration';

const serverlessConfiguration: AWS & Lift = {
  service: `${projectName}-documentation`, // Keep it short to have role name below 64
  frameworkVersion: '>=3.0.0',
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
      domain: ['www.swarmion.dev', 'swarmion.dev'],
      redirectToMainDomain: true,
      certificate:
        'arn:aws:acm:us-east-1:801673046086:certificate/fbf65a9c-2280-4895-af86-3bd180f9605c',
    },
  },
  resources: {
    Description: 'Documentation cloudfront service',
  },
};

module.exports = serverlessConfiguration;
