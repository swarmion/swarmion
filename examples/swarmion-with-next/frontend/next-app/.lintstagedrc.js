const baseConfig = require('../../.lintstagedrc');

module.exports = {
  ...baseConfig,
  '*.{ts,tsx}': 'pnpm stylelint-fix',
};
