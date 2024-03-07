import { AWS } from '@serverless/typescript';

import {
  listDeploymentsContract,
  onDeploymentRequestedContract,
  onDeploymentUpdatedContract,
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

import { functions } from './functions';
import { OrchestratorStack } from './resources';

const serverlessConfiguration: AWS &
  ServerlessContracts &
  ServerlessCdkPluginConfig = {
  service: `${projectName}-orchestrator`, // Keep it short to have role name below 64
  frameworkVersion,
  configValidationMode: 'error',
  plugins: [
    'serverless-better-credentials',
    'serverless-esbuild',
    '@swarmion/serverless-cdk-plugin',
    '@swarmion/serverless-plugin',
    'serverless-iam-roles-per-function',
    'serverless-custom-iam-roles-per-function',
    'serverless-analyze-bundle-plugin',
  ],
  params: sharedParams,
  provider: sharedProviderConfig,
  functions,
  package: { individually: true },
  custom: {
    esbuild: sharedEsbuildConfig,
    cdkPlugin: {
      stack: OrchestratorStack,
    },
  },
  contracts: {
    provides: {
      requestSyncDeploymentContract,
      listDeploymentsContract,
      onDeploymentRequestedContract,
    },
    consumes: { onDeploymentRequestedContract, onDeploymentUpdatedContract },
  },
  resources: {
    Description: 'Monorepo deployments orchestrator',
  },
};

module.exports = serverlessConfiguration;
