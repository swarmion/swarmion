import { swarmionCdkEsbuildConfig } from '@swarmion/serverless-helpers';
import { BundlingOptions } from 'aws-cdk-lib/aws-lambda-nodejs';

export const projectName = 'swarmion-starter';
export const region = 'eu-west-1';

export const sharedLambdaEsbuildConfig = {
  ...swarmionCdkEsbuildConfig,
} satisfies BundlingOptions;
