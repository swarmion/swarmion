import { joinPathFragments } from '@nrwl/devkit';

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
        'contracts/core-contracts/tsconfig.build.json',
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
