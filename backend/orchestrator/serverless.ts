import { AWS } from '@serverless/typescript';

import {
  projectName,
  sharedEsbuildConfig,
  sharedParams,
  sharedProviderConfig,
} from '@swarmion/serverless-configuration';
import { ServerlessContracts } from '@swarmion/serverless-plugin';

import { functions } from './functions';
import { Resources } from './resources';

const serverlessConfiguration: AWS & ServerlessContracts = {
  service: `${projectName}-orchestrator`, // Keep it short to have role name below 64
  frameworkVersion: '>=2.61.0',
  configValidationMode: 'error',
  plugins: [
    'serverless-esbuild',
    '@swarmion/serverless-plugin',
    'serverless-iam-roles-per-function',
  ],
  params: sharedParams,
  provider: {
    ...sharedProviderConfig,
  },
  functions,
  package: { individually: true },
  custom: {
    projectName,
    esbuild: sharedEsbuildConfig,
  },
  contracts: {
    provides: {},
    consumes: {},
  },
  resources: {
    Description: 'Monorepo deployments orchestrator',
    Resources,
  },
};

module.exports = serverlessConfiguration;
