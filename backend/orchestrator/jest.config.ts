import { jestConfig } from '@swarmion/configuration';

export default {
  ...jestConfig,
  moduleDirectories: ['node_modules', '<rootDir>'],
};
