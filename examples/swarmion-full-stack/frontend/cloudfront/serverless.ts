import { AWS } from '@serverless/typescript';
import { mergeStageParams } from '@swarmion/serverless-helpers';
import type { Lift } from 'serverless-lift';

import {
  frameworkVersion,
  projectName,
  sharedParams,
  sharedProviderConfig,
} from '@swarmion-full-stack/serverless-configuration';

const serverlessConfiguration: AWS & Lift = {
  service: `${projectName}-frontend`, // Keep it short to have role name below 64
  frameworkVersion,
  plugins: ['serverless-lift'],
  provider: sharedProviderConfig,
  params: mergeStageParams(sharedParams, {
    dev: {}, // place here service-specific dev params
    staging: {}, // place here service-specific staging params
    production: {}, // place here service-specific production params
  }),
  constructs: {
    app: {
      type: 'static-website',
      path: '../app/dist',
    },
  },
  lift: { automaticPermissions: false },
  resources: {
    Description: 'Frontend cloudfront service',
  },
};

module.exports = serverlessConfiguration;
