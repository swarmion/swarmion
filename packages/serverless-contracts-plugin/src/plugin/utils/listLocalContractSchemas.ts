import { JSONSchema } from 'json-schema-to-ts';
import isUndefined from 'lodash/isUndefined';
import mapValues from 'lodash/mapValues';
import omitBy from 'lodash/omitBy';
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const { provides, consumes } = serverless.service.initialServerlessConfig
    .contracts as ServerlessContracts;

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
