import { AWS } from '@serverless/typescript';

import { ServerlessCdkPlugin } from 'serverlessCdk';
import { ServerlessCdkPluginConfig } from 'types';

import { MyConstruct } from './myConstruct';

const getCdkProperty = ServerlessCdkPlugin.getCdkPropertyHelper<MyConstruct>;

const serverlessConfiguration: AWS & ServerlessCdkPluginConfig = {
  service: 'test-app',
  configValidationMode: 'error',
  plugins: ['../../src'],
  provider: {
    name: 'aws',
  },
  functions: {
    testFunction: {
      environment: {
        ORCHESTRATOR_TABLE_NAME: getCdkProperty('dynamodbName'),
        ORCHESTRATOR_TABLE_ARN: getCdkProperty('dynamodbArn'),
        TEST_OUTPUT_SERVERLESS_CONFIG_VALUE: getCdkProperty(
          'testServerlessConfigValue',
        ),
      },
      handler: './lambda.js',
    },
  },
  construct: MyConstruct,
  resources: {
    Outputs: {
      testOutput: { Description: 'Some Test Output' },
    },
  },
};

module.exports = serverlessConfiguration;
