import { AWS } from '@serverless/typescript';

import { ServerlessCdkPluginConfig } from 'types';

import { MyConstruct } from './myConstruct';

const serverlessConfiguration: AWS & ServerlessCdkPluginConfig = {
  service: 'test-app',
  configValidationMode: 'error',
  plugins: ['../../src'],
  provider: {
    name: 'aws',
  },
  construct: MyConstruct,
};

module.exports = serverlessConfiguration;
