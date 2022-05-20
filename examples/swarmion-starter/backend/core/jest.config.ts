import { jestConfig } from '@swarmion-starter/configuration';

export default {
  ...jestConfig,
  moduleDirectories: ['node_modules', '<rootDir>'],
};
