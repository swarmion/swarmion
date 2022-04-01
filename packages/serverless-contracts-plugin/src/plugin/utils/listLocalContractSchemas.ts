import mapValues from 'lodash/mapValues';
import Serverless from 'serverless';

import {
  ServerlessContracts,
  ServerlessContractSchemas,
} from 'types/serviceOptions';

export const listLocalContractSchemas = (
  serverless: Serverless,
): ServerlessContractSchemas => {
  // @ts-ignore mistype in the orignals (the animals)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const { provides, consumes } = serverless.service.initialServerlessConfig
    .contracts as ServerlessContracts;

  return {
    provides: mapValues(provides, contract => contract.fullContractSchema),
    consumes: mapValues(consumes, contract => contract.fullContractSchema),
  };
};
