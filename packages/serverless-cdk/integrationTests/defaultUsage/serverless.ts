import { AWS } from 'types';
import { MyConstruct } from './myConstruct';

const serverlessConfiguration: AWS = {
  service: 'test-app',
  configValidationMode: 'error',
  plugins: ['../../src'],
  provider: {
    name: 'aws',
  },
  serverlessCdkBridge: MyConstruct,
};

module.exports = serverlessConfiguration;
