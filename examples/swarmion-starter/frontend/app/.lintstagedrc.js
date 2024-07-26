import baseConfig from '../../.lintstagedrc.js';

export default {
  ...baseConfig,
  '*.{ts,tsx}': 'pnpm stylelint-fix',
};
