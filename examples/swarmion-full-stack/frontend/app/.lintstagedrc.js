const baseConfig = require('../../.lintstagedrc');

module.exports = {
  ...baseConfig,
  '*.{ts,tsx}': 'yarn stylelint-fix',
};
