import { JSONSchema } from 'json-schema-to-ts';
import isUndefined from 'lodash/isUndefined.js';
import mapValues from 'lodash/mapValues.js';
import omitBy from 'lodash/omitBy.js';
import Serverless from 'serverless';

import { getContractFullSchema } from '@swarmion/serverless-contracts';

import {
  ServerlessContracts,
  ServerlessContractSchemas,
} from 'types/serviceOptions';

export const listLocalContractSchemas = (
  serverless: Serverless,
): ServerlessContractSchemas => {
  // @ts-ignore mistype in the orignals (the animals 🐶)
  const { provides, consumes } =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    serverless.service.initialServerlessConfig.contracts as ServerlessContracts;

  return {
    provides: omitBy(
      mapValues(provides, contract => getContractFullSchema(contract)),
      isUndefined,
    ) as Record<string, JSONSchema>,
    consumes: omitBy(
      mapValues(consumes, contract => getContractFullSchema(contract)),
      isUndefined,
    ) as Record<string, JSONSchema>,
  };
};
