import { AWS } from '@serverless/typescript';

import { ServerlessCdkPluginConfig } from 'types';

const serverlessConfiguration: AWS & ServerlessCdkPluginConfig = {
  service: 'test-app',
  configValidationMode: 'error',
  plugins: ['../../src'],
  provider: {
    name: 'aws',
  },
  custom: {
    cdkPlugin: {
      // This is the goal of the test
      // @ts-expect-error Type 'ErrorConstructor' is not assignable to type 'typeof ServerlessStack | typeof Stack'.
      stack: Error,
    },
  },
};

module.exports = serverlessConfiguration;
