import { NormalizedSchema, PackageJson } from '../../types';

export const packageJson = (options: NormalizedSchema): PackageJson => ({
  name: `@${options.workspaceName}/${options.importPath}`,
  private: true,
  version: '1.0.0',
  license: 'UNLICENSED',
  sideEffects: false,
  files: ['dist'],
  main: 'dist/index.cjs.js',
  module: 'dist/index.esm.js',
  types: 'dist/types/index.d.ts',
  scripts: {
    clean: 'rimraf dist',
    'lint-fix': 'pnpm linter-base-config --fix',
    'lint-fix-all': 'pnpm lint-fix .',
    'linter-base-config': 'eslint --ext=js,ts',
    package:
      'pnpm clean && pnpm package-transpile && pnpm package-types && pnpm package-types-aliases',
    'package-transpile': 'tsup src/index.ts',
    'package-types': 'tsc -p tsconfig.build.json',
    'package-types-aliases': 'tsc-alias -p tsconfig.build.json',
    test: 'nx run test-linter && nx run test-type && nx run test-unit && nx run test-circular',
    'test-circular': 'pnpm depcruise --validate .dependency-cruiser.js src',
    'test-linter': 'pnpm linter-base-config .',
    'test-type': 'tsc --noEmit --emitDeclarationOnly false',
    'test-unit': 'vitest run --coverage --passWithNoTests',
    watch: "pnpm clean dist && concurrently 'pnpm:package-* --watch'",
  },
  devDependencies: {
    '@types/node': 'latest',
    '@vitest/coverage-c8': 'latest',
    concurrently: 'latest',
    'dependency-cruiser': 'latest',
    eslint: 'latest',
    'json-schema-to-ts': 'latest',
    prettier: 'latest',
    rimraf: 'latest',
    'ts-node': 'latest',
    'tsc-alias': 'latest',
    tsup: 'latest',
    typescript: 'latest',
    vite: 'latest',
    'vite-tsconfig-paths': 'latest',
    vitest: 'latest',
  },
});
