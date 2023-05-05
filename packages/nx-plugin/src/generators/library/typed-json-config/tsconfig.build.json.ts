import { joinPathFragments } from '@nx/devkit';

import { NormalizedSchema, TsConfig } from '../../types';

export const packageBuildTsConfig = (options: NormalizedSchema): TsConfig => ({
  extends: joinPathFragments(options.offsetFromRoot, 'tsconfig.options.json'),
  compilerOptions: {
    baseUrl: 'src',
    rootDir: 'src',
    outDir: './dist/types',
    tsBuildInfoFile: 'tsconfig.build.tsbuildinfo',
  },
  include: ['./**/*.ts'],
  exclude: ['./vite*', './**/*.test.ts', './dist', './tsup.config.ts'],
});
