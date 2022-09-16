import { joinPathFragments } from '@nrwl/devkit';

import { NormalizedSchema, TsConfig } from '../../types';

export const packageTsConfig = (options: NormalizedSchema): TsConfig => ({
  extends: joinPathFragments(options.offsetFromRoot, 'tsconfig.json'),
  compilerOptions: {
    baseUrl: 'src',
    composite: true,
    // @ts-expect-error ttypescript types are not defined
    plugins: [{ transform: '@zerollup/ts-transform-paths' }],
    outDir: './dist/types',
  },
  exclude: ['./dist'],
  include: ['./**/*.ts'],
});
