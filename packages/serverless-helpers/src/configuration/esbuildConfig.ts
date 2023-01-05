import type { BuildOptions } from 'esbuild';

type EsbuildOptions = Omit<BuildOptions, 'watch'>;

/**
 * The interface for the Swarmion recommended configuration
 *
 * See https://github.com/floydspace/serverless-esbuild/blob/master/src/types.ts#L24
 * And https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs.BundlingOptions.html
 */
export interface SwarmionEsbuildConfig extends EsbuildOptions {
  concurrency?: number;
  packager: PackagerId;
  exclude: '*' | string[];
}

type PackagerId = 'npm' | 'pnpm' | 'yarn';

/**
 * the recommended esbuild configuration for Swarmion
 */
export const swarmionEsbuildConfig: SwarmionEsbuildConfig = {
  packager: 'pnpm',
  bundle: true,
  minify: true,
  keepNames: true,
  sourcemap: true,
  exclude: ['aws-sdk'],
  target: 'node16',
  platform: 'node',
  mainFields: ['module', 'main'],
  concurrency: 5,
};
