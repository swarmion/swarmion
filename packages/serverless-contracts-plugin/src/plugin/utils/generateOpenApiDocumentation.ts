import Serverless from 'serverless';

import { getOpenApiDocumentation } from '@swarmion/serverless-contracts';

import { ServerlessContracts } from 'types/serviceOptions';

export const generateOpenApiDocumentation = (serverless: Serverless): void => {
  // @ts-ignore mistype in the orignals (the animals)
  const { provides } =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    serverless.service.initialServerlessConfig.contracts as ServerlessContracts;

  const openApiDocumentation = getOpenApiDocumentation({
    title: serverless.service.getServiceName(),
    description: (serverless.service.initialServerlessConfig as Serverless)
      .resources.Description,
    contracts: Object.values(provides),
  });

  console.log(JSON.stringify(openApiDocumentation, null, 2));
};
