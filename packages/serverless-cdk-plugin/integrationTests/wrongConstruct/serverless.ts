import { AWS } from '@serverless/typescript';

import { CdkPluginConfig } from '../../src/types';

const serverlessConfiguration: AWS & CdkPluginConfig = {
  service: 'test-app',
  configValidationMode: 'error',
  plugins: ['../../src'],
  provider: {
    name: 'aws',
  },
  // This is the goal of the test
  // @ts-expect-error TS2741: Property 'isConstruct' is missing in type 'ErrorConstructor' but required in type 'typeof Construct'.
  cdkConstruct: Error,
};

module.exports = serverlessConfiguration;
