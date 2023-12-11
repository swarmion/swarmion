import {
  APIGatewayEventRequestContextV2WithAuthorizer,
  APIGatewayProxyCognitoAuthorizer,
} from 'aws-lambda';
import { build } from 'esbuild';
import path from 'path';
import { bench, describe } from 'vitest';

import { getAPIGatewayV2EventRequestContextMock } from '@swarmion/serverless-helpers';

import { getHandlerContextMock } from '__mocks__/requestContext';

import { handler } from './basicHttpApiHandler';

const fakeRequestContext: APIGatewayEventRequestContextV2WithAuthorizer<APIGatewayProxyCognitoAuthorizer> =
  {
    ...getAPIGatewayV2EventRequestContextMock(),
    accountId: '123456789012' as const,
    authorizer: { claims: { foo: 'claimBar' } },
  };
const baseEvent = {
  pathParameters: { userId: 'toto', pageNumber: '15' },
  body: JSON.stringify({ foo: 'bar' }),
  headers: {
    myHeader: 'MyCustomHeader',
    anotherHeader: 'anotherHeader',
  },
  queryStringParameters: { testId: 'myTestId' },
  requestContext: fakeRequestContext,
  version: '',
  routeKey: '',
  rawPath: '',
  rawQueryString: '',
  isBase64Encoded: false,
};
const fakeContext = getHandlerContextMock();

const bundledHandler = await build({
  entryPoints: [path.join(__dirname, 'basicHttpApiHandler.ts')],
  bundle: true,
  write: false,
});
const bundledHandlerString = new TextDecoder().decode(
  bundledHandler.outputFiles[0]?.contents,
);

describe('ApiGateway::basic handler', () => {
  bench(
    'bundled cold start',
    () => {
      eval(bundledHandlerString);
    },
    { warmupIterations: 0 },
  );

  bench('basic handler invocation', async () => {
    await handler(baseEvent, fakeContext, () => null);
  });
});
