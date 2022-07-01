import { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'test-app',
  configValidationMode: 'error',
  plugins: ['../../src'],
  provider: {
    name: 'aws',
  },
  custom: {
    myConstruct: Error,
  },
};

module.exports = serverlessConfiguration;
