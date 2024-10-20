import {
  APIGatewayEventRequestContextV2WithAuthorizer,
  APIGatewayProxyCognitoAuthorizer,
  APIGatewayProxyEventV2WithRequestContext,
} from 'aws-lambda';
import { build } from 'esbuild';
import path from 'path';
import { bench, describe } from 'vitest';

import { getAPIGatewayV2EventRequestContextMock } from '@swarmion/serverless-helpers';

import { getHandlerContextMock } from '__mocks__/requestContext';

import { handler } from './basicHttpApiRouterHandler';

const fakeRequestContext: APIGatewayEventRequestContextV2WithAuthorizer<APIGatewayProxyCognitoAuthorizer> =
  {
    ...getAPIGatewayV2EventRequestContextMock({
      http: {
        method: 'GET',
        path: '/users/toto/page/15',
        protocol: '',
        sourceIp: '',
        userAgent: '',
      },
    }),
    accountId: '123456789012' as const,
    authorizer: { claims: { foo: 'claimBar' } },
  };
const baseEvent: APIGatewayProxyEventV2WithRequestContext<
  typeof fakeRequestContext
> = {
  body: JSON.stringify({ foo: 'bar' }),
  headers: {
    myHeader: 'MyCustomHeader',
    anotherHeader: 'anotherHeader',
  },
  queryStringParameters: { testId: 'myTestId' },
  requestContext: fakeRequestContext,
  version: '',
  routeKey: '',
  rawPath: '/users/toto/page/15',
  rawQueryString: '',
  isBase64Encoded: false,
};

const fakeContext = getHandlerContextMock();

const bundledHandler = await build({
  entryPoints: [path.join(__dirname, 'basicHttpApiRouterHandler.ts')],
  bundle: true,
  write: false,
});
const bundledHandlerString = new TextDecoder().decode(
  bundledHandler.outputFiles[0]?.contents,
);

describe('ApiGateway::basic router handler', () => {
  bench(
    'bundled cold start',
    () => {
      eval(bundledHandlerString);
    },
    { warmupIterations: 0 },
  );

  bench('basic handler invocation', async () => {
    expect(await handler(baseEvent, fakeContext, () => null)).toMatchObject({
      statusCode: 200,
      body: JSON.stringify({
        id: 'hello',
        name: 'bar15myTestIdMyCustomHeaderclaimBar',
      }),
    });
  });
});
