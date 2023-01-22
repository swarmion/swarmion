import {
  APIGatewayEventRequestContextV2WithAuthorizer,
  APIGatewayProxyCognitoAuthorizer,
} from 'aws-lambda';

import { getAPIGatewayV2EventRequestContextMock } from '@swarmion/serverless-helpers';

import { getHandlerContextMock } from '__mocks__/requestContext';
import { getHandler } from 'features';

import { httpApiGatewayContractMock } from './__mocks__/httpApiGatewayContract';

const httpApiContract = httpApiGatewayContractMock;

const fakeRequestContext: APIGatewayEventRequestContextV2WithAuthorizer<APIGatewayProxyCognitoAuthorizer> =
  {
    ...getAPIGatewayV2EventRequestContextMock(),
    accountId: '123456789012' as const,
    authorizer: { claims: { foo: 'claimBar' } },
  };
const fakeContext = getHandlerContextMock();

const basicHttpApiHandler = async (): Promise<void> => {
  // simulate creation of the handler during the cold start
  const httpHandler = getHandler(httpApiContract)(
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

      return Promise.resolve({ id: 'hello', name });
    },
  );

  // simulate the handler being called 50 times
  for (let i = 0; i < 50; i++) {
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
  }
};

export default basicHttpApiHandler;
