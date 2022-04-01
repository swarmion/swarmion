import isNull from 'lodash/isNull';
import mapValues from 'lodash/mapValues';
import omitBy from 'lodash/omitBy';
import { OpenAPIV3 } from 'openapi-types';
import Serverless from 'serverless';

import { ServerlessContracts } from 'types/serviceOptions';

export const generateOpenApiDocumentation = (serverless: Serverless): void => {
  // @ts-ignore mistype in the orignals (the animals)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const { provides } = serverless.service.initialServerlessConfig
    .contracts as ServerlessContracts;

  const paths: OpenAPIV3.PathsObject = omitBy(
    mapValues(provides, contract =>
      contract.getopenApiDocumentation
        ? contract.getopenApiDocumentation().documentation
        : null,
    ),
    isNull,
  );

  const openApiDocumentation: OpenAPIV3.Document = {
    openapi: '3.0.1',
    info: {
      title: serverless.service.getServiceName(),
      description: (serverless.service.initialServerlessConfig as Serverless)
        .resources.Description,
      version: new Date().toISOString(),
    },
    paths,
  };
  console.log(JSON.stringify(openApiDocumentation, null, 2));
};
