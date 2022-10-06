export const projectName = 'swarmion-full-stack';
export const region = 'eu-west-1';
export const frameworkVersion = '>=3.0.0';

export const defaultEnvironment = 'dev';

export const sharedProviderConfig = {
  name: 'aws',
  runtime: 'nodejs16.x',
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
 * A set of shared parameters, scoped by stage. You can extend them to add other shared parameters between services.
 *
 * See https://www.serverless.com/framework/docs/providers/aws/guide/variables#referencing-parameters
 *
 * An empty string for a profile means that the default profile will be used
 */
export const sharedParams = {
  dev: { profile: 'swarmion-full-stack-developer' },
  staging: { profile: '' },
  production: { profile: '' },
};

export const sharedEsbuildConfig = {
  packager: 'pnpm',
  bundle: true,
  minify: true,
  keepNames: true,
  sourcemap: true,
  exclude: ['aws-sdk'],
  target: 'node16',
  platform: 'node',
  /**
   * Sets the resolution order for esbuild.
   *
   * In order to enable tree-shaking of packages, we need specify `module` first (ESM)
   * Because it defaults to "main" first (CJS, not tree shakeable)
   * https://esbuild.github.io/api/#main-fields
   */
  mainFields: ['module', 'main'],
  concurrency: 5,
};
