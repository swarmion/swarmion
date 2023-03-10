import {
  APIGatewayEventRequestContextJWTAuthorizer,
  APIGatewayEventRequestContextV2WithAuthorizer,
} from 'aws-lambda';
import { A } from 'ts-toolbelt';

import { HttpStatusCodes } from 'types/http';

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
  SwarmionApiGatewayEvent,
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
  outputSchemas: {
    [HttpStatusCodes.OK]: outputSchema,
  },
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
type MyHelperEventType = SwarmionApiGatewayEvent<typeof httpApiGatewayContract>;
type ExpectedEventType = {
  requestContext: APIGatewayEventRequestContextV2WithAuthorizer<APIGatewayEventRequestContextJWTAuthorizer> & {
    accountId: '123456789012';
    authorizer: {
      claims: {
        foo: string;
      } & {
        [x: string]: unknown;
      };
    } & {
      [x: string]: unknown;
    };
  } & {
    [x: string]: unknown;
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
  };
  headers: {
    myHeader: string;
  } & {
    [x: string]: unknown;
  };
};

type Check = A.Equals<MyEventType, ExpectedEventType>;

const check: Check = 1;
check;

type CheckHelper = A.Equals<MyHelperEventType, ExpectedEventType>;

const checkHelper: CheckHelper = 1;
checkHelper;

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
