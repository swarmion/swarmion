import {
  APIGatewayEventRequestContextV2WithAuthorizer,
  APIGatewayProxyCognitoAuthorizer,
} from 'aws-lambda';

import { getAPIGatewayV2EventRequestContextMock } from '@swarmion/serverless-helpers';

import { getHandlerContextMock } from '__mocks__/requestContext';
import { getHandler } from 'features';

import { httpApiGatewayContractMock } from '../__mocks__/httpApiGatewayContract.bench';

const httpApiContract = httpApiGatewayContractMock;

const fakeRequestContext: APIGatewayEventRequestContextV2WithAuthorizer<APIGatewayProxyCognitoAuthorizer> =
  {
    ...getAPIGatewayV2EventRequestContextMock(),
    accountId: '123456789012' as const,
    authorizer: { claims: { foo: 'claimBar' } },
  };
const fakeContext = getHandlerContextMock();

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

const basicHttpApiHandlerInvocationBench = async (): Promise<void> => {
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
};

const basicHttpApiHandlerInstantiationBench = (): void => {
  getHandler(httpApiContract)(
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
};

export default {
  instantiation: basicHttpApiHandlerInstantiationBench,
  invocation: basicHttpApiHandlerInvocationBench,
};
