import type { JestConfigWithTsJest } from 'ts-jest/dist/types';

const TEST_REGEX = '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?|tsx?|ts?)$';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testRegex: TEST_REGEX,
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  testEnvironment: 'node',
  coverageReporters: ['json', ['lcov', { projectRoot: './' }]],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  testTimeout: 10000,
};

export default config;
