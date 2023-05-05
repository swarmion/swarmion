import {
  APIGatewayEventRequestContextJWTAuthorizer,
  APIGatewayEventRequestContextV2WithAuthorizer,
} from 'aws-lambda';
import { A } from 'ts-toolbelt';

import { HttpStatusCodes } from 'types/http';
import { typeAssert } from 'utils';

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
    [x: string]: unknown;
    accountId: '123456789012';
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

typeAssert<A.Equals<MyEventType, ExpectedEventType>>();

typeAssert<A.Equals<MyHelperEventType, ExpectedEventType>>();

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

typeAssert<A.Equals<IncompleteEventType, ExpectedIncompleteEventType>>();
