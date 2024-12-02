import { joinPathFragments } from '@nx/devkit';

import { NormalizedSchema, TsConfig } from '../../types';

export const packageTsConfig = (options: NormalizedSchema): TsConfig => ({
  extends: joinPathFragments(options.offsetFromRoot, 'tsconfig.options.json'),
  compilerOptions: {
    baseUrl: '.',
    emitDeclarationOnly: false,
    declaration: false,
    declarationMap: false,
    composite: false,
    noEmit: true,
  },
  references: [
    {
      path: joinPathFragments(
        options.offsetFromRoot,
        'packages/cdk-configuration/tsconfig.build.json',
      ),
    },
  ],
  exclude: ['./cdk.out'],
  include: ['./**/*.ts', 'vitest.config.mts'],
  'ts-node': {
    transpileOnly: true,
  },
});
