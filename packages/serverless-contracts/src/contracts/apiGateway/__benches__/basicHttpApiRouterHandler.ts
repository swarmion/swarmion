import Ajv from 'ajv';

import { HttpStatusCodes } from 'types';

import { httpApiGatewayContractMock } from '../__mocks__/httpApiGatewayContract';
import { ApiGatewayContract } from '../apiGatewayContract';
import { handle, SwarmionRouter } from '../features';

const ajv = new Ajv({ keywords: ['faker'] });

const httpApiContract = httpApiGatewayContractMock;
const router = new SwarmionRouter({ ajv });

router.add(httpApiContract)(
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

router.add(
  new ApiGatewayContract({
    path: '/test-rest',
    method: 'GET',
    id: 'test-rest',
    integrationType: 'restApi',
  }),
)(() =>
  Promise.resolve({
    statusCode: HttpStatusCodes.OK,
  }),
);

router.add(
  new ApiGatewayContract({
    path: '/test-http',
    method: 'GET',
    id: 'test-http',
    integrationType: 'httpApi',
  }),
)(() =>
  Promise.resolve({
    statusCode: HttpStatusCodes.OK,
  }),
);

export const handler = handle(router);
