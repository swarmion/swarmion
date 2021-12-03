import { resolve } from 'path';
import type { InitialOptionsTsJest } from 'ts-jest/dist/types';

import { jestConfig } from '@serverless-contracts/configuration';

const config: InitialOptionsTsJest = {
  ...jestConfig,
  moduleNameMapper: {
    '^utils/(.*)$': resolve(__dirname, 'utils/$1'),
  },
};

export default config;
