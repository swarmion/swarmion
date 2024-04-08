import { joinPathFragments } from '@nx/devkit';

import { getWorkspaceDependencyVersion } from 'generators/helpers';

import { NormalizedSchema, PackageJson } from '../../types';

export const packageJson = (options: NormalizedSchema): PackageJson => ({
  name: `@${options.workspaceName}/${options.importPath}`,
  private: true,
  version: '1.0.0',
  license: 'UNLICENSED',
  scripts: {
    bootstrap: `cdk bootstrap --profile ${options.workspaceName}-developer --qualifier ${options.hashedProjectName}`,
    'bootstrap-production': `cdk bootstrap --context stage=production --qualifier ${options.hashedProjectName}`,
    'bootstrap-staging': `cdk bootstrap --context stage=staging --qualifier ${options.hashedProjectName}`,
    deploy: `cdk deploy --profile ${options.workspaceName}-developer`,
    'deploy-production': 'cdk deploy --context stage=production',
    'deploy-staging': 'cdk deploy --context stage=staging',
    destroy: `cdk destroy --profile ${options.workspaceName}-developer`,
    'destroy-production': 'cdk destroy --context stage=production',
    'destroy-staging': 'cdk destroy --context stage=staging',
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
    [`@${options.workspaceName}/cdk-configuration`]: 'workspace:^',
    '@middy/core': '^4.7.0',
    '@middy/http-cors': '^4.7.0',
    '@swarmion/serverless-contracts': 'latest',
    '@swarmion/serverless-helpers': 'latest',
    ajv: getWorkspaceDependencyVersion('ajv'),
  },
  devDependencies: {
    '@types/node': getWorkspaceDependencyVersion('@types/node'),
    '@vitest/coverage-v8': getWorkspaceDependencyVersion('@vitest/coverage-v8'),
    'aws-cdk-lib': getWorkspaceDependencyVersion('aws-cdk-lib'),
    constructs: getWorkspaceDependencyVersion('constructs'),
    'dependency-cruiser': getWorkspaceDependencyVersion('dependency-cruiser'),
    esbuild: getWorkspaceDependencyVersion('esbuild'),
    eslint: getWorkspaceDependencyVersion('eslint'),
    prettier: getWorkspaceDependencyVersion('prettier'),
    'ts-node': getWorkspaceDependencyVersion('ts-node'),
    typescript: getWorkspaceDependencyVersion('typescript'),
    'vite-tsconfig-paths': getWorkspaceDependencyVersion('vite-tsconfig-paths'),
    vitest: getWorkspaceDependencyVersion('vitest'),
  },
});
