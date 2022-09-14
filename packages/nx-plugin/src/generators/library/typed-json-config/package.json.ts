import { join } from 'path';

import { NormalizedSchema, PackageJson } from '../../types';

export const packageJson = (options: NormalizedSchema): PackageJson => ({
  name: `@${options.workspaceName}/${options.importPath}`,
  private: true,
  version: '1.0.0',
  license: 'UNLICENSED',
  sideEffects: false,
  files: ['dist'],
  main: 'dist/cjs/index.js',
  module: 'dist/esm/index.js',
  types: 'dist/types/index.d.ts',
  scripts: {
    'lint-fix': 'yarn linter-base-config --fix',
    'lint-fix-all': 'yarn lint-fix .',
    'linter-base-config': 'eslint --ext=js,ts',
    package:
      'rm -rf dist && yarn package-cjs && yarn package-esm && yarn package-types',
    'package-cjs':
      'NODE_ENV=cjs yarn transpile --out-dir dist/cjs --source-maps',
    'package-esm':
      'NODE_ENV=esm yarn transpile --out-dir dist/esm --source-maps',
    'package-types': 'ttsc -p tsconfig.build.json',
    test: 'yarn test-linter && yarn test-type && yarn test-unit && yarn test-circular',
    'test-circular': 'yarn depcruise --validate .dependency-cruiser.js src',
    'test-linter': 'yarn linter-base-config .',
    'test-type': 'tsc --noEmit --emitDeclarationOnly false',
    'test-unit': 'vitest run --coverage',
    transpile: 'babel src --extensions .ts --quiet',
    watch: "rm -rf dist && concurrently 'yarn:package-* --watch'",
  },
  dependencies: {
    '@babel/runtime': 'latest',
  },
  devDependencies: {
    '@babel/cli': 'latest',
    '@babel/core': 'latest',
    '@babel/plugin-transform-runtime': 'latest',
    '@babel/preset-env': 'latest',
    '@babel/preset-typescript': 'latest',
    '@types/node': 'latest',
    '@vitest/coverage-c8': 'latest',
    '@zerollup/ts-transform-paths': 'latest',
    'babel-plugin-module-resolver': 'latest',
    concurrently: 'latest',
    'dependency-cruiser': 'latest',
    eslint: 'latest',
    'json-schema-to-ts': 'latest',
    prettier: 'latest',
    'ts-node': 'latest',
    ttypescript: 'latest',
    typescript: 'latest',
    'vite-tsconfig-paths': 'latest',
    vitest: 'latest',
  },
  nx: {
    targets: {
      package: {
        outputs: [join(options.packageRoot, 'dist')],
      },
    },
  },
});
