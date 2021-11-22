import { resolve } from 'path';

import { jestConfig } from '@serverless-contracts/configuration';

export default {
  ...jestConfig,
  moduleNameMapper: {
    '^utils/(.*)$': resolve(__dirname, 'utils/$1'),
  },
};
