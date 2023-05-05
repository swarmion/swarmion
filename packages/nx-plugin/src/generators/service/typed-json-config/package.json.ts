import { joinPathFragments } from '@nx/devkit';

import {
  typescriptVersion,
  vitestCoverageC8Version,
  vitestVersion,
  viteTsConfigPathsVersion,
} from 'generators/helpers';

import { NormalizedSchema, PackageJson } from '../../types';

export const packageJson = (options: NormalizedSchema): PackageJson => ({
  name: `@${options.workspaceName}/${options.importPath}`,
  private: true,
  version: '1.0.0',
  license: 'UNLICENSED',
  scripts: {
    deploy: 'serverless deploy',
    'deploy-production': 'serverless deploy --stage production',
    'deploy-staging': 'serverless deploy --stage staging',
    destroy: 'serverless remove',
    'destroy-production': 'serverless remove --stage production',
    'destroy-staging': 'serverless remove --stage staging',
    'format-check': `prettier --check . ${joinPathFragments(
      options.offsetFromRoot,
      '.prettierignore',
    )}`,
    'format-fix': `prettier --write . ${joinPathFragments(
      options.offsetFromRoot,
      '.prettierignore',
    )}`,
    'lint-fix': 'pnpm linter-base-config --fix',
    'lint-fix-all': 'pnpm lint-fix .',
    'linter-base-config': 'eslint --ext=js,ts',
    test: 'nx run format-check && nx run test-linter && nx run test-type && nx run test-unit && nx run test-circular',
    'test-circular': 'pnpm depcruise --validate .dependency-cruiser.js .',
    'test-linter': 'pnpm linter-base-config .',
    'test-type': 'tsc',
    'test-unit': 'vitest run --coverage --passWithNoTests',
  },
  dependencies: {
    [`@${options.workspaceName}/serverless-configuration`]: 'workspace:^',
    '@swarmion/serverless-helpers': 'latest',
  },
  devDependencies: {
    '@serverless/typescript': 'latest',
    '@types/node': 'latest',
    '@vitest/coverage-c8': vitestCoverageC8Version,
    'dependency-cruiser': 'latest',
    esbuild: 'latest',
    eslint: 'latest',
    serverless: 'latest',
    'serverless-custom-iam-roles-per-function': 'latest',
    'serverless-esbuild': 'latest',
    'serverless-iam-roles-per-function': 'latest',
    'ts-node': 'latest',
    typescript: typescriptVersion,
    'vite-tsconfig-paths': viteTsConfigPathsVersion,
    vitest: vitestVersion,
  },
});
