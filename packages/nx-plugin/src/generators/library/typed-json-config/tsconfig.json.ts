import { joinPathFragments } from '@nrwl/devkit';

import { NormalizedSchema, TsConfig } from '../../types';

export const packageTsConfig = (options: NormalizedSchema): TsConfig => ({
  extends: joinPathFragments(options.offsetFromRoot, 'tsconfig.options.json'),
  compilerOptions: {
    baseUrl: 'src',
  },
  include: ['./**/*.ts'],
  exclude: ['./dist'],
});
