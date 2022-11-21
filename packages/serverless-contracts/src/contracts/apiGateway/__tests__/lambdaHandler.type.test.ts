import {
  APIGatewayEventRequestContextJWTAuthorizer,
  APIGatewayEventRequestContextV2WithAuthorizer,
} from 'aws-lambda';
import { A } from 'ts-toolbelt';

import {
  bodySchema,
  headersSchema,
  outputSchema,
  pathParametersSchema,
  queryStringParametersSchema,
} from '../__mocks__/httpApiGatewayContract';
import { ApiGatewayContract } from '../apiGatewayContract';
import { HandlerEventType } from '../types';

export const httpApiGatewayContract = new ApiGatewayContract({
  id: 'testContract',
  path: '/users/{userId}',
  method: 'GET',
  integrationType: 'httpApi',
  authorizerType: 'jwt',
  pathParametersSchema,
  queryStringParametersSchema,
  headersSchema,
  bodySchema,
  outputSchema,
});

type MyEventType = HandlerEventType<typeof httpApiGatewayContract>;
type ExpectedEventType = {
  requestContext: APIGatewayEventRequestContextV2WithAuthorizer<APIGatewayEventRequestContextJWTAuthorizer>;
} & {
  pathParameters: {
    userId: string;
    pageNumber: string;
  };
  queryStringParameters: {
    testId: string;
  };
  body: {
    foo: string;
    [x: string]: unknown;
  };
  headers: {
    [x: string]: unknown;
    myHeader: string;
  };
};

type Check = A.Equals<MyEventType, ExpectedEventType>;

const check: Check = 1;
check;
