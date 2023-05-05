import { joinPathFragments } from '@nx/devkit';

import { NormalizedSchema, TsConfig } from '../../types';

export const packageTsConfig = (options: NormalizedSchema): TsConfig => ({
  extends: joinPathFragments(options.offsetFromRoot, 'tsconfig.options.json'),
  compilerOptions: {
    baseUrl: '.',
    emitDeclarationOnly: false,
    noEmit: true,
  },
  references: [
    {
      path: joinPathFragments(
        options.offsetFromRoot,
        'packages/serverless-configuration/tsconfig.build.json',
      ),
    },
  ],
  include: ['./**/*.ts'],
});
