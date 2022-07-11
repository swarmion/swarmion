import { jestConfig } from '@swarmion/configuration';

export default {
  ...jestConfig,
  testTimeout: 10000,
  // This is a temporary fix for jest 28. See https://github.com/microsoft/accessibility-insights-web/pull/5421/commits/9ad4e618019298d82732d49d00aafb846fb6bac7
  // We need to remove it as soon as possible. Check out https://github.com/facebook/jest/issues/9430
  resolver: './integrationTests/jest28TemporaryResolver.js',
};
