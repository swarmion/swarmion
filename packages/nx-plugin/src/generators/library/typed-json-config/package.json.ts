import { joinPathFragments } from '@nx/devkit';

import { getWorkspaceDependencyVersion } from 'generators/helpers';

import { NormalizedSchema, PackageJson } from '../../types';

export const packageJson = (options: NormalizedSchema): PackageJson => ({
  name: `@${options.workspaceName}/${options.importPath}`,
  private: true,
  version: '1.0.0',
  license: 'UNLICENSED',
  sideEffects: false,
  files: ['dist'],
  type: 'module',
  main: 'dist/index.cjs',
  module: 'dist/index.js',
  types: 'dist/types/index.d.ts',
  scripts: {
    clean: 'rimraf dist *.tsbuildinfo',
    'format-check': `prettier --check . --ignore-path ${joinPathFragments(
      options.offsetFromRoot,
      '.prettierignore',
    )}`,
    'format-fix': `prettier --write . --ignore-path ${joinPathFragments(
      options.offsetFromRoot,
      '.prettierignore',
    )}`,
    'lint-fix': 'pnpm linter-base-config --fix',
    'lint-fix-all': 'pnpm lint-fix .',
    'linter-base-config': 'eslint --ext=js,ts',
    package:
      'pnpm clean && pnpm package-transpile && pnpm package-types && pnpm package-types-aliases',
    'package-transpile': 'tsup',
    'package-types': 'tsc -p tsconfig.build.json',
    'package-types-aliases': 'tsc-alias -p tsconfig.build.json',
    test: 'nx run format-check && nx run test-linter && nx run test-type && nx run test-unit && nx run test-circular',
    'test-circular': 'pnpm depcruise --config -- src',
    'test-linter': 'pnpm linter-base-config .',
    'test-type': 'tsc --noEmit --emitDeclarationOnly false',
    'test-unit': 'vitest run --coverage --passWithNoTests',
    watch: "pnpm clean dist && concurrently 'pnpm:package-* --watch'",
  },
  devDependencies: {
    '@types/node': getWorkspaceDependencyVersion('@types/node'),
    '@vitest/coverage-v8': getWorkspaceDependencyVersion('vitest'), // force to use the same version as vitest
    concurrently: getWorkspaceDependencyVersion('concurrently'),
    'dependency-cruiser': getWorkspaceDependencyVersion('dependency-cruiser'),
    eslint: getWorkspaceDependencyVersion('eslint'),
    'json-schema-to-ts': getWorkspaceDependencyVersion('json-schema-to-ts'),
    prettier: getWorkspaceDependencyVersion('prettier'),
    rimraf: getWorkspaceDependencyVersion('rimraf'),
    'ts-node': getWorkspaceDependencyVersion('ts-node'),
    'tsc-alias': getWorkspaceDependencyVersion('tsc-alias'),
    tsup: getWorkspaceDependencyVersion('tsup'),
    typescript: getWorkspaceDependencyVersion('typescript'),
    'vite-tsconfig-paths': getWorkspaceDependencyVersion('vite-tsconfig-paths'),
    vitest: getWorkspaceDependencyVersion('vitest'),
  },
});
