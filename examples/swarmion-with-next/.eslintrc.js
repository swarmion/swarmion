/* eslint-disable max-lines */
module.exports = {
  extends: ['eslint:recommended', 'plugin:import/recommended'],
  ignorePatterns: [
    '**/node_modules/',
    '**/nx-cache/',
    '**/dist/',
    '**/cdk.out/',
    '**/coverage/',
    '**/build/',
    '**/public/',
  ],
  rules: {
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    'import/no-duplicates': 'error',
    complexity: ['error', 8],
    'max-lines': ['error', 200],
    'max-depth': ['error', 3],
    'max-params': ['error', 4],
    eqeqeq: ['error', 'smart'],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'no-shadow': [
      'error',
      {
        hoist: 'all',
      },
    ],
    'prefer-const': 'error',
    'import/order': [
      'error',
      {
        pathGroups: [{ pattern: '@swarmion-with-next/**', group: 'unknown' }],
        groups: [
          ['external', 'builtin'],
          'unknown',
          'internal',
          ['parent', 'sibling', 'index'],
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: false,
        },
        'newlines-between': 'always',
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },
    ],
    'prefer-arrow/prefer-arrow-functions': [
      'error',
      {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: false,
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@swarmion-with-next/*/*'],
            message:
              'import of internal modules must be done at the root level.',
          },
        ],
        paths: [
          {
            name: 'lodash',
            message: 'Please use lodash/{module} import instead',
          },
          {
            name: 'aws-sdk',
            message: 'Please use aws-sdk/{module} import instead',
          },
          {
            name: '.',
            message: 'Please use explicit import file',
          },
        ],
      },
    ],
    curly: ['error', 'all'],
  },
  root: true,
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  plugins: ['prefer-arrow', 'import'],
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: 'tsconfig.json',
      },
      rules: {
        '@typescript-eslint/prefer-optional-chain': 'error',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/ban-ts-comment': [
          'error',
          { minimumDescriptionLength: 10 },
        ],
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        '@typescript-eslint/no-restricted-types': [
          'error',
          {
            types: {
              FC: 'Use `const MyComponent = (props: Props): React.JSX.Element` instead',
              SFC: 'Use `const MyComponent = (props: Props): React.JSX.Element` instead',
              FunctionComponent:
                'Use `const MyComponent = (props: Props): React.JSX.Element` instead',
              'React.FC':
                'Use `const MyComponent = (props: Props): React.JSX.Element` instead',
              'React.SFC':
                'Use `const MyComponent = (props: Props): React.JSX.Element` instead',
              'React.FunctionComponent':
                'Use `const MyComponent = (props: Props): React.JSX.Element` instead',
            },
          },
        ],
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
        '@typescript-eslint/no-unnecessary-condition': 'error',
        '@typescript-eslint/no-unnecessary-type-arguments': 'error',
        '@typescript-eslint/prefer-string-starts-ends-with': 'error',
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
      },
    },
    {
      files: ['**/src/**'],
      excludedFiles: ['**/__tests__/**', '**/*.test.ts?(x)', '**/testUtils/**'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: false,
            optionalDependencies: false,
            peerDependencies: true,
          },
        ],
      },
    },
  ],
};
