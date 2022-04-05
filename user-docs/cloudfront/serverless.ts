import { AWS } from '@serverless/typescript';
import type { Lift } from 'serverless-lift';

import {
  projectName,
  sharedParams,
  sharedProviderConfig,
} from '@swarmion/serverless-configuration';

const serverlessConfiguration: AWS & Lift = {
  service: `${projectName}-frontend`, // Keep it short to have role name below 64
  frameworkVersion: '>=3.0.0',
  plugins: ['serverless-lift'],
  provider: sharedProviderConfig,
  params: sharedParams,
  custom: {
    projectName,
  },
  constructs: {
    app: {
      type: 'static-website',
      path: '../app/dist',
    },
  },
  resources: {
    Description: 'Frontend cloudfront service',
  },
};

module.exports = serverlessConfiguration;
