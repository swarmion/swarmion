import { AWS } from '@serverless/typescript';

import { getCdkPropertyHelper } from 'helper';

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
        ORCHESTRATOR_TABLE_NAME:
          getCdkPropertyHelper<MyConstruct>('dynamodbName'),
        ORCHESTRATOR_TABLE_ARN:
          getCdkPropertyHelper<MyConstruct>('dynamodbArn'),
        TEST_OUTPUT_SERVERLESS_CONFIG_VALUE: getCdkPropertyHelper<MyConstruct>(
          'testServerlessConfigValue',
        ),
      },
      handler: './lambda.js',
    },
  },
  serverlessConstruct: MyConstruct,
  resources: {
    Outputs: {
      testOutput: { Description: 'Some Test Output' },
    },
  },
};

module.exports = serverlessConfiguration;
