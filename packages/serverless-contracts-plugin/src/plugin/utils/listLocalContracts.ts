import Serverless from 'serverless';

import { ServerlessContracts } from 'types/serviceOptions';

export const listLocalContracts = (
  serverless: Serverless,
): ServerlessContracts => {
  // @ts-ignore mistype in the orignals (the animals)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const { provides, consumes } = serverless.service.initialServerlessConfig
    .contracts as ServerlessContracts;

  return { provides, consumes };
};
