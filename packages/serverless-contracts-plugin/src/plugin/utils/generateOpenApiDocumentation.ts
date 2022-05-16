import { OpenAPIV3 } from 'openapi-types';
import Serverless from 'serverless';

import { getOpenApiDocumentation } from '@swarmion/serverless-contracts';

import { ServerlessContracts } from 'types/serviceOptions';

import { isDefined } from './isDefined';

export const generateOpenApiDocumentation = (serverless: Serverless): void => {
  // @ts-ignore mistype in the orignals (the animals)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const { provides } = serverless.service.initialServerlessConfig
    .contracts as ServerlessContracts;

  const contractDocumentations = Object.values(provides)
    .map(contract => getOpenApiDocumentation(contract))
    .filter(isDefined);

  const paths: OpenAPIV3.PathsObject =
    contractDocumentations.reduce<OpenAPIV3.PathsObject>(
      (pathsObject, pathDocumentation) => {
        pathsObject[pathDocumentation.path] = {
          [pathDocumentation.method]: pathDocumentation.documentation,
        };

        return pathsObject;
      },
      {},
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
