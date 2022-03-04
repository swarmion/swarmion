import { noUndeclaredContracts } from './rules';

module.exports = {
  rules: { 'no-undeclared-contracts': noUndeclaredContracts },
  configs: {
    recommended: {
      plugins: ['@swarmion'],
      rules: {
        '@swarmion/no-undeclared-contracts': 'error',
      },
    },
  },
};
