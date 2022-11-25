import { joinPathFragments } from '@nrwl/devkit';

import { NormalizedSchema, TsConfig } from '../../types';

export const packageBuildTsConfig = (options: NormalizedSchema): TsConfig => ({
  extends: joinPathFragments(options.offsetFromRoot, 'tsconfig.options.json'),
  compilerOptions: {
    baseUrl: 'src',
    rootDir: 'src',
    outDir: './dist/types',
  },
  include: ['./**/*.ts'],
  exclude: ['./vite*', './**/*.test.ts', './dist'],
});
