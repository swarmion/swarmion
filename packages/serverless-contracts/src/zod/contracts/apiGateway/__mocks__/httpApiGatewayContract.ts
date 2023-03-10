import { z } from 'zod';

import { HttpStatusCodes } from 'types/http';

import { ApiGatewayContract } from '../apiGatewayContract';

export const pathParametersSchema = z.object({
  userId: z.string(),
  pageNumber: z.string(),
});

export const queryStringParametersSchema = z.object({
  testId: z.string(),
});

export const headersSchema = z
  .object({
    myHeader: z.string(),
  })
  .passthrough();

export const bodySchema = z.object({
  foo: z.string(),
});

export const outputSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const outputSchemas = {
  [HttpStatusCodes.OK]: outputSchema,
};

export const outputSchema2 = z.object({
  id: z.string(),
  age: z.number(),
});

export const requestContextSchema = z
  .object({
    accountId: z.literal('123456789012'),
    authorizer: z
      .object({
        claims: z
          .object({
            foo: z.string(),
          })
          .passthrough(),
      })
      .passthrough(),
  })
  .passthrough();

export const httpApiGatewayContractMock = new ApiGatewayContract({
  id: 'testContract',
  path: '/users/{userId}',
  method: 'GET',
  integrationType: 'httpApi',
  authorizerType: 'cognito',
  pathParametersSchema,
  queryStringParametersSchema,
  headersSchema,
  bodySchema,
  outputSchemas: {
    [HttpStatusCodes.OK]: outputSchema,
    [HttpStatusCodes.BAD_REQUEST]: outputSchema2,
  },
  requestContextSchema,
});
