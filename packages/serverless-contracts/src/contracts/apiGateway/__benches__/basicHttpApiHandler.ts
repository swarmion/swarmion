import Ajv from 'ajv';

import { getHandler } from 'features';
import { HttpStatusCodes } from 'types';

import { httpApiGatewayContractMock } from '../__mocks__/httpApiGatewayContract';

const ajv = new Ajv({ keywords: ['faker'] });

const httpApiContract = httpApiGatewayContractMock;

export const handler = getHandler(httpApiContract, { ajv })(async ({
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
