import { AWS } from '@serverless/typescript';
import { mergeStageParams } from '@swarmion/serverless-helpers';

import { httpApiResourceContract } from '@swarmion-starter/core-contracts';
import {
  frameworkVersion,
  projectName,
  sharedEsbuildConfig,
  sharedParams,
  sharedProviderConfig,
} from '@swarmion-starter/serverless-configuration';

import { functions } from './functions/config';

const serverlessConfiguration: AWS = {
  service: `${projectName}-core`, // Keep it short to have role name below 64
  frameworkVersion,
  configValidationMode: 'error',
  plugins: ['serverless-esbuild'],
  provider: sharedProviderConfig,
  functions,
  package: { individually: true },
  params: mergeStageParams(sharedParams, {
    dev: {}, // place here service-specific dev params
    staging: {}, // place here service-specific staging params
    production: {}, // place here service-specific production params
  }),
  custom: {
    esbuild: sharedEsbuildConfig,
  },
  resources: {
    Description: 'Core service',
    Outputs: {
      HttpApiId: httpApiResourceContract.exportValue({
        description: 'The shared httpApi resource',
        value: { Ref: 'HttpApi' },
      }),
    },
  },
};

module.exports = serverlessConfiguration;
