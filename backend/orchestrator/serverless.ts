import { AWS } from '@serverless/typescript';

import { requestSyncDeployment } from '@swarmion/orchestrator-contracts';
// eslint-disable-next-line no-restricted-imports
import { CdkPluginConfig } from '@swarmion/serverless-cdk-plugin/helper';
import {
  frameworkVersion,
  projectName,
  sharedEsbuildConfig,
  sharedParams,
  sharedProviderConfig,
} from '@swarmion/serverless-configuration';
import { ServerlessContracts } from '@swarmion/serverless-plugin';

import { functions } from 'functions';
// import { cdkResources } from 'resources';
import { OrchestratorDynamodb } from 'resources/dynamodb';

const serverlessConfiguration: AWS & ServerlessContracts & CdkPluginConfig = {
  service: `${projectName}-orchestrator`, // Keep it short to have role name below 64
  frameworkVersion,
  configValidationMode: 'error',
  plugins: [
    'serverless-esbuild',
    '@swarmion/serverless-plugin',
    'serverless-iam-roles-per-function',
    'serverless-analyze-bundle-plugin',
    'serverless-cdk-plugin',
  ],
  serverlessConstruct: OrchestratorDynamodb,
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
    provides: {
      requestSyncDeployment,
    },
    consumes: {},
  },
  resources: {
    Description: 'Monorepo deployments orchestrator',
    // ...cdkResources,
  },
};

module.exports = serverlessConfiguration;
