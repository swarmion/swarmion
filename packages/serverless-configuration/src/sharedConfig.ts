import {
  ServerlessProviderConfig,
  swarmionCdkEsbuildConfig,
  swarmionEsbuildConfig,
} from '@swarmion/serverless-helpers';

export const projectName = 'swarmion';
export const region = 'eu-west-1';
export const frameworkVersion = '>=3.0.0';

export const defaultEnvironment = 'dev';

export const sharedProviderConfig: ServerlessProviderConfig = {
  name: 'aws',
  runtime: 'nodejs22.x',
  architecture: 'arm64',
  region,
  profile: '${param:profile}', // Used to point to the right AWS account
  stage: "${opt:stage, 'dev'}", // Doc: https://www.serverless.com/framework/docs/providers/aws/guide/credentials/
  environment: {
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
  },
  deploymentMethod: 'direct',
  httpApi: {
    payload: '2.0',
    cors: {
      // @ts-expect-error we use a configuration per environment so we put it as a serverless variable
      allowedOrigins: '${param:apiGatewayCorsAllowedOrigins}',
      allowedHeaders: ['Content-Type', 'Authorization', 'Origin'],
      allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowCredentials: true,
    },
    metrics: true,
  },
};

/**
 * common profiles settings. This must be put in the `custom` section of the `serverless.ts`
 * config files since stage params cannot be used for the profile. See https://github.com/serverless/serverless/issues/10642
 *
 * An empty string for a profile means that the default profile will be used
 */
export const sharedParams = {
  dev: {
    profile: 'swarmion-developer',
    apiGatewayCorsAllowedOrigins: ['http://localhost:3000'],
  },
  staging: { profile: '', apiGatewayCorsAllowedOrigins: [] },
  production: { profile: '', apiGatewayCorsAllowedOrigins: [] },
};

export const sharedEsbuildConfig = swarmionEsbuildConfig;
export const sharedCdkEsbuildConfig = swarmionCdkEsbuildConfig;
