import { AWS } from '@serverless/typescript';

import { CdkPluginConfig } from '../../src/types';
import { MyConstruct } from './myConstruct';

const serverlessConfiguration: AWS & CdkPluginConfig = {
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
  cdkConstruct: MyConstruct,
};

module.exports = serverlessConfiguration;
