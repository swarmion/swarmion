import { AWS } from '@serverless/typescript';

import { CdkPluginConfig } from 'types';

import { MyConstruct } from './myConstruct';

const serverlessConfiguration: AWS & CdkPluginConfig = {
  service: 'test-app',
  configValidationMode: 'error',
  plugins: ['../../src'],
  provider: {
    name: 'aws',
  },
  serverlessConstruct: MyConstruct,
};

module.exports = serverlessConfiguration;
