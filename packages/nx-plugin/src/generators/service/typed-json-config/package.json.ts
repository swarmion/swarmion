import { joinPathFragments } from '@nx/devkit';

import { getWorkspaceDependencyVersion } from 'generators/helpers';

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
    '@serverless/typescript': getWorkspaceDependencyVersion(
      '@serverless/typescript',
    ),
    '@types/node': getWorkspaceDependencyVersion('@types/node'),
    '@vitest/coverage-v8': getWorkspaceDependencyVersion('@vitest/coverage-v8'),
    'dependency-cruiser': getWorkspaceDependencyVersion('dependency-cruiser'),
    esbuild: getWorkspaceDependencyVersion('esbuild'),
    eslint: getWorkspaceDependencyVersion('eslint'),
    serverless: getWorkspaceDependencyVersion('serverless'),
    'serverless-custom-iam-roles-per-function': getWorkspaceDependencyVersion(
      'serverless-custom-iam-roles-per-function',
    ),
    'serverless-esbuild': getWorkspaceDependencyVersion('serverless-esbuild'),
    'serverless-iam-roles-per-function': getWorkspaceDependencyVersion(
      'serverless-iam-roles-per-function',
    ),
    'ts-node': getWorkspaceDependencyVersion('ts-node'),
    typescript: getWorkspaceDependencyVersion('typescript'),
    'vite-tsconfig-paths': getWorkspaceDependencyVersion('vite-tsconfig-paths'),
    vitest: getWorkspaceDependencyVersion('vitest'),
  },
});
