import { joinPathFragments } from '@nrwl/devkit';

import { NormalizedSchema, TsConfig } from '../../types';

export const packageTsConfig = (options: NormalizedSchema): TsConfig => ({
  extends: joinPathFragments(options.offsetFromRoot, 'tsconfig.json'),
  compilerOptions: {
    baseUrl: 'src',
    composite: true,
    outDir: './dist/types',
  },
  exclude: ['./dist'],
  include: ['./**/*.ts'],
});
