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
    'linter-base-config': 'eslint --ext=js,ts .',
    package:
      'rm -rf dist && yarn package-cjs && yarn package-esm && yarn package-types',
    'package-cjs':
      'NODE_ENV=cjs yarn transpile --out-dir dist/cjs --source-maps',
    'package-esm':
      'NODE_ENV=esm yarn transpile --out-dir dist/esm --source-maps',
    'package-types': 'ttsc -p tsconfig.build.json',
    test: 'yarn test-linter && yarn test-type && yarn test-unit && yarn test-circular',
    'test-circular': 'yarn depcruise --validate .dependency-cruiser.js .',
    'test-linter': 'yarn linter-base-config .',
    'test-type': 'tsc --noEmit --emitDeclarationOnly false',
    'test-unit': 'jest --runInBand --collectCoverage --logHeapUsage',
    transpile: 'babel src --extensions .ts --quiet',
    watch: "rm -rf dist && concurrently 'yarn:package-* --watch'",
  },
  dependencies: {
    '@babel/runtime': '^7.17.2',
  },
  devDependencies: {
    [`@${options.workspaceName}/configuration`]: 'workspace:*',
    '@babel/cli': '^7.17.6',
    '@babel/core': '^7.17.5',
    '@babel/plugin-transform-runtime': '^7.17.0',
    '@babel/preset-env': '^7.16.11',
    '@babel/preset-typescript': '^7.16.7',
    '@types/node': '^17.0.21',
    '@zerollup/ts-transform-paths': '^1.7.18',
    'babel-plugin-module-resolver': '^4.1.0',
    concurrently: '^7.0.0',
    'dependency-cruiser': '^11.2.1',
    eslint: '^8.9.0',
    jest: '^27.5.1',
    'json-schema-to-ts': '^1.6.5',
    prettier: '^2.5.1',
    'ts-node': '^10.5.0',
    ttypescript: '^1.5.13',
    typescript: '^4.5.5',
  },
  nx: {
    targets: {
      package: {
        outputs: [join(options.packageRoot, 'dist')],
      },
    },
  },
});
