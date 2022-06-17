import { AWS } from '@serverless/typescript';

import { MyConstruct } from './myConstruct';

const serverlessConfiguration: AWS = {
  service: 'test-app',
  configValidationMode: 'error',
  plugins: ['../../src'],
  provider: {
    name: 'aws',
  },
  functions: {
    testFunction: {
      environment: {
        ORCHESTRATOR_TABLE_NAME: '${serverlessCdkBridgePlugin:dynamodbName}',
        ORCHESTRATOR_TABLE_ARN: '${serverlessCdkBridgePlugin:dynamodbArn}',
      },
      handler: './lambda.js',
    },
  },
  custom: {
    myConstruct: MyConstruct,
  },
};

module.exports = serverlessConfiguration;
