import { swarmionCdkEsbuildConfig } from '@swarmion/serverless-helpers';
import { BundlingOptions, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs';

export const projectName = 'swarmion-starter';
export const region = 'eu-west-1';

export const sharedLambdaEsbuildConfig = {
  ...swarmionCdkEsbuildConfig,
  minify: false,
  format: OutputFormat.ESM,
  banner:
    "import { createRequire } from 'module';const require = createRequire(import.meta.url);",
} satisfies BundlingOptions;
