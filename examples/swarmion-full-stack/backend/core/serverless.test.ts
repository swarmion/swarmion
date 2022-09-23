import { AWS } from '@serverless/typescript';
import { testFunctionNames } from '@swarmion/serverless-helpers';

import * as sc from './serverless';

const serverlessConfiguration = sc as AWS;

/**
 * serverless tests
 */
describe('root service serverless.ts', () => {
  testFunctionNames(serverlessConfiguration);
});
