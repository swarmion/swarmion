import { AWS } from '@serverless/typescript';

import {
  listDeploymentsContract,
  onDeploymentRequestedContract,
  requestSyncDeploymentContract,
} from '@swarmion/orchestrator-contracts';
import { ServerlessCdkPluginConfig } from '@swarmion/serverless-cdk-plugin';
import {
  frameworkVersion,
  projectName,
  sharedEsbuildConfig,
  sharedParams,
  sharedProviderConfig,
} from '@swarmion/serverless-configuration';
import { ServerlessContracts } from '@swarmion/serverless-plugin';

import { functions } from 'functions';
import { OrchestratorService } from 'resources';

const serverlessConfiguration: AWS &
  ServerlessContracts &
  ServerlessCdkPluginConfig = {
  service: `${projectName}-orchestrator`, // Keep it short to have role name below 64
  frameworkVersion,
  configValidationMode: 'error',
  plugins: [
    'serverless-esbuild',
    '@swarmion/serverless-cdk-plugin',
    '@swarmion/serverless-plugin',
    'serverless-iam-roles-per-function',
    'serverless-custom-iam-roles-per-function',
    'serverless-analyze-bundle-plugin',
  ],
  construct: OrchestratorService,
  params: sharedParams,
  provider: {
    ...sharedProviderConfig,
  },
  functions,
  package: { individually: true },
  custom: {
    esbuild: sharedEsbuildConfig,
  },
  contracts: {
    provides: {
      requestSyncDeploymentContract,
      listDeploymentsContract,
      onDeploymentRequestedContract,
    },
    consumes: { onDeploymentRequestedContract },
  },
  resources: {
    Description: 'Monorepo deployments orchestrator',
  },
};

module.exports = serverlessConfiguration;
