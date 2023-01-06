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
  requestContextSchema,
} from '../__mocks__/httpApiGatewayContract';
import { ApiGatewayContract } from '../apiGatewayContract';
import {
  BodyType,
  CustomRequestContextType,
  HandlerEventType,
  HeadersType,
  PathParametersType,
  QueryStringParametersType,
} from '../types';

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
  requestContextSchema,
});

type ContractType = typeof httpApiGatewayContract;

type MyEventType = HandlerEventType<
  ContractType['integrationType'],
  ContractType['authorizerType'],
  PathParametersType<ContractType>,
  QueryStringParametersType<ContractType>,
  HeadersType<ContractType>,
  CustomRequestContextType<ContractType>,
  BodyType<ContractType>
>;
type ExpectedEventType = {
  requestContext: APIGatewayEventRequestContextV2WithAuthorizer<APIGatewayEventRequestContextJWTAuthorizer> & {
    [x: string]: unknown;
    authorizer: {
      [x: string]: unknown;
      claims: {
        [x: string]: unknown;
        foo: string;
      };
    };
  };
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

// test with some keys missing
type IncompleteEventType = HandlerEventType<
  ContractType['integrationType'],
  ContractType['authorizerType'],
  PathParametersType<ContractType>,
  QueryStringParametersType<ContractType>,
  undefined,
  undefined,
  undefined
>;
type ExpectedIncompleteEventType = {
  requestContext: APIGatewayEventRequestContextV2WithAuthorizer<APIGatewayEventRequestContextJWTAuthorizer>;
  pathParameters: {
    userId: string;
    pageNumber: string;
  };
  queryStringParameters: {
    testId: string;
  };
};

type CheckIncomplete = A.Equals<
  IncompleteEventType,
  ExpectedIncompleteEventType
>;

const checkIncomplete: CheckIncomplete = 1;
checkIncomplete;
