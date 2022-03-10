import { jestConfig } from '@swarmion/configuration';

export default {
  ...jestConfig,
  moduleNameMapper: { '^utils(/(.*)|)$': '<rootDir>/src/utils/$1' },
};
