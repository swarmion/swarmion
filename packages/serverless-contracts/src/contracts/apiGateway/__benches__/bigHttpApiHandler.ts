import Ajv from 'ajv';

import { getHandler } from 'features';
import { HttpStatusCodes } from 'types';

import { bigHttpApiContract } from '../__mocks__/bigHttpApiGatewayContract';

const ajv = new Ajv({ keywords: ['faker'] });

export const handler = getHandler(bigHttpApiContract, { ajv })(async ({
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
