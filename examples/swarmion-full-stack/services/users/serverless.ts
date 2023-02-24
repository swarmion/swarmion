import { AWS } from '@serverless/typescript';

import {
  frameworkVersion,
  projectName,
  sharedEsbuildConfig,
  sharedParams,
  sharedProviderConfig,
} from '@swarmion-full-stack/serverless-configuration';

import { functions } from './functions/config';

const serverlessConfiguration: AWS = {
  service: `${projectName}-users`, // Keep it short to have role name below 64
  frameworkVersion,
  configValidationMode: 'error',
  plugins: ['serverless-esbuild', 'serverless-iam-roles-per-function'],
  provider: sharedProviderConfig,
  params: sharedParams,
  functions,
  package: { individually: true },
  custom: {
    esbuild: sharedEsbuildConfig,
  },
  resources: {
    Description: 'Users service: manage users',
  },
};

module.exports = serverlessConfiguration;
