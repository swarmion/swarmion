import { AWS } from '@serverless/typescript';
import type { Lift } from 'serverless-lift';

import {
  frameworkVersion,
  projectName,
  sharedParams,
  sharedProviderConfig,
} from '@swarmion/serverless-configuration';
import { mergeStageParams } from '@swarmion/serverless-helpers';

const serverlessConfiguration: AWS & Lift = {
  service: `${projectName}-documentation`, // Keep it short to have role name below 64
  frameworkVersion,
  plugins: ['serverless-lift'],
  provider: sharedProviderConfig,
  params: mergeStageParams(sharedParams, {
    dev: {
      domain: [],
      redirectToMainDomain: false,
      certificate: '',
    },
    staging: { domain: [], redirectToMainDomain: false, certificate: '' },
    production: {
      domain: ['www.swarmion.dev', 'swarmion.dev'],
      redirectToMainDomain: true,
      certificate:
        'arn:aws:acm:us-east-1:592210495815:certificate/2192e96e-8469-49b1-a0a4-8b80d7a4c660',
    },
  }),
  constructs: {
    app: {
      type: 'static-website',
      path: '../documentation/build',
      errorPage: '404.html',
      domain: '${param:domain}',
      redirectToMainDomain: '${param:redirectToMainDomain}',
      certificate: '${param:certificate}',
    },
  },
  lift: { automaticPermissions: false },
  resources: {
    Description: 'Documentation cloudfront service',
  },
};

module.exports = serverlessConfiguration;
