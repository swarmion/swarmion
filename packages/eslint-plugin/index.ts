import { noUndeclaredContracts } from './rules';

module.exports = {
  rules: { 'no-undeclared-contracts': noUndeclaredContracts },
  configs: {
    recommended: {
      plugins: ['@serverless-contracts'],
      rules: {
        '@serverless-contracts/no-undeclared-contracts': 'error',
      },
    },
  },
};
