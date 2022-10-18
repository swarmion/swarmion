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
        'arn:aws:acm:us-east-1:801673046086:certificate/fbf65a9c-2280-4895-af86-3bd180f9605c',
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
