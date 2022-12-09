import { AWS } from '@serverless/typescript';

import { ServerlessCdkPluginConfig } from 'types';

import { MyStack } from './myStack';

const serverlessConfiguration: AWS & ServerlessCdkPluginConfig = {
  service: 'test-app',
  configValidationMode: 'error',
  plugins: ['../../src'],
  provider: {
    name: 'aws',
  },
  custom: {
    cdkPlugin: {
      stack: MyStack,
    },
  },
};

module.exports = serverlessConfiguration;
