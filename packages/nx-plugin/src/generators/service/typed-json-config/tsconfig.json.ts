import { joinPathFragments } from '@nrwl/devkit';

import { NormalizedSchema, TsConfig } from '../../types';

export const packageTsConfig = (options: NormalizedSchema): TsConfig => ({
  extends: joinPathFragments(options.offsetFromRoot, 'tsconfig.json'),
  compilerOptions: {
    preserveSymlinks: true,
    baseUrl: '.',
    esModuleInterop: true,
  },
  references: [
    {
      path: joinPathFragments(
        options.offsetFromRoot,
        'contracts/core-contracts/tsconfig.build.json',
      ),
    },
    {
      path: joinPathFragments(
        options.offsetFromRoot,
        'packages/configuration/tsconfig.build.json',
      ),
    },
    {
      path: joinPathFragments(
        options.offsetFromRoot,
        'packages/serverless-configuration/tsconfig.build.json',
      ),
    },
  ],
  include: ['./**/*.ts'],
  'ts-node': {
    files: true,
  },
});
