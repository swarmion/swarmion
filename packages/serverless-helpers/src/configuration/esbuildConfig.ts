import type { BundlingOptions } from 'aws-cdk-lib/aws-lambda-nodejs';
import type { BuildOptions } from 'esbuild';

export type { BundlingOptions };

type EsbuildOptions = Omit<BuildOptions, 'watch'>;

/**
 * The interface for the Swarmion recommended configuration
 *
 * See https://github.com/floydspace/serverless-esbuild/blob/master/src/types.ts#L24
 * And https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs.BundlingOptions.html
 */
export interface SwarmionEsbuildConfig extends EsbuildOptions {
  /**
   * Documentation: https://esbuild.github.io/api/#target
   *
   * Note that for Swarmion, we do not need the `string[]` possibility, so we can remove it
   */
  target?: string;
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
  target: 'node22',
  platform: 'node',
  mainFields: ['module', 'main'],
  concurrency: 5,
};

/**
 * the recommended CDK esbuild configuration for Swarmion.
 *
 * - `target` is inferred from the construct runtime
 * - `exclude` is already default depending on the runtime
 */
export const swarmionCdkEsbuildConfig: BundlingOptions = {
  minify: true,
  keepNames: true,
  sourceMap: true,
  mainFields: ['module', 'main'],
};
