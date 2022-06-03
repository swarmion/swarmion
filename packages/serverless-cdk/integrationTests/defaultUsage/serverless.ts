import { AWS } from '@serverless/typescript';

import { MyConstruct } from './myConstruct';

const serverlessConfiguration: AWS = {
  service: 'test-app',
  configValidationMode: 'error',
  plugins: ['../../src'],
  provider: {
    name: 'aws',
  },
  custom: {
    myConstruct: MyConstruct,
  },
};

module.exports = serverlessConfiguration;
