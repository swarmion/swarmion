import Ajv from 'ajv';
import {
  APIGatewayEventRequestContextV2WithAuthorizer,
  APIGatewayProxyCognitoAuthorizer,
} from 'aws-lambda';
import { bench, describe } from 'vitest';

import { getAPIGatewayV2EventRequestContextMock } from '@swarmion/serverless-helpers';

import { getHandlerContextMock } from '__mocks__/requestContext';
import { getHandler } from 'features';
import { HttpStatusCodes } from 'types';

import { bigHttpApiContract } from '../__mocks__/bigHttpApiGatewayContract';

const ajv = new Ajv({ keywords: ['faker'] });

const fakeRequestContext: APIGatewayEventRequestContextV2WithAuthorizer<APIGatewayProxyCognitoAuthorizer> =
  {
    ...getAPIGatewayV2EventRequestContextMock(),
    accountId: '123456789012' as const,
    authorizer: { claims: { foo: 'claimBar' } },
  };
const fakeContext = getHandlerContextMock();

const httpHandler = getHandler(bigHttpApiContract, { ajv })(async ({
  body,
  pathParameters,
  queryStringParameters,
  headers,
  requestContext,
}) => {
  const myCustomClaim = requestContext.authorizer.claims.foo;

  const name =
    body.foo +
    pathParameters.pageNumber +
    queryStringParameters.testId +
    headers.myHeader +
    myCustomClaim;

  return Promise.resolve({
    statusCode: HttpStatusCodes.OK,
    body: { id: 'hello', name },
  });
});

describe('ApiGatewayContract', () => {
  bench('handler with 500 properties instantiation', () => {
    getHandler(bigHttpApiContract, { ajv })(
      async ({
        body,
        pathParameters,
        queryStringParameters,
        headers,
        requestContext,
      }) => {
        const myCustomClaim = requestContext.authorizer.claims.foo;

        const name =
          body.foo +
          pathParameters.pageNumber +
          queryStringParameters.testId +
          headers.myHeader +
          myCustomClaim;

        return Promise.resolve({
          statusCode: HttpStatusCodes.OK,
          body: { id: 'hello', name },
        });
      },
    );
  });

  bench('handler with 500 properties invocation', async () => {
    await httpHandler(
      {
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
      },
      fakeContext,
      () => null,
    );
  });
});
