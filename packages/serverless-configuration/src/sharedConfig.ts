export const projectName = 'swarmion';
export const region = 'eu-west-1';

export const defaultEnvironment = 'dev';

export const sharedProviderConfig = {
  name: 'aws',
  runtime: 'nodejs14.x',
  architecture: 'arm64',
  region,
  profile: '${param:profile}', // Used to point to the right AWS account
  stage: "${opt:stage, 'dev'}", // Doc: https://www.serverless.com/framework/docs/providers/aws/guide/credentials/
  environment: {
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
  },
} as const;

/**
 * common profiles settings. This must be put in the `custom` section of the `serverless.ts`
 * config files since stage params cannot be used for the profile. See https://github.com/serverless/serverless/issues/10642
 *
 * An empty string for a profile means that the default profile will be used
 */
export const sharedParams = {
  dev: { profile: 'swarmion-developer' },
  staging: { profile: '' },
  production: { profile: '' },
};

export const sharedEsbuildConfig = {
  packager: 'yarn',
  bundle: true,
  minify: true,
  keepNames: true,
  sourcemap: true,
  exclude: ['aws-sdk'],
  target: 'node14',
  platform: 'node',
  mainFields: ['module', 'main'],
  concurrency: 5,
};
