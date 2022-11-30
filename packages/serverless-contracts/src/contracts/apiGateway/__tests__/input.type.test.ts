import { A } from 'ts-toolbelt';

import {
  bodySchema,
  headersSchema,
  pathParametersSchema,
  queryStringParametersSchema,
} from '../__mocks__/httpApiGatewayContract';
import { InputType } from '../types';

/******************* INSTANTIATE Schemas ****************/

type ClosedInputSchema = InputType<
  typeof pathParametersSchema,
  typeof queryStringParametersSchema,
  undefined,
  typeof bodySchema
>;

type OpenInputSchema = InputType<
  typeof pathParametersSchema,
  typeof queryStringParametersSchema,
  typeof headersSchema,
  undefined
>;

/******************* Check the resolution with FromSchema ****************/

type ExpectedClosedInput = {
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
};

type CheckClosedResolved = A.Equals<ClosedInputSchema, ExpectedClosedInput>;

const checkClosedResolved: CheckClosedResolved = 1;
checkClosedResolved;

type ExpectedOpenInput = {
  pathParameters: {
    userId: string;
    pageNumber: string;
  };
  queryStringParameters: {
    testId: string;
  };
  headers: {
    [x: string]: unknown;
    myHeader: string;
  };
};

type CheckOpenResolved = A.Equals<OpenInputSchema, ExpectedOpenInput>;

const checkOpenResolved: CheckOpenResolved = 1;
checkOpenResolved;

/******************* Check the resolution with FromSchema ****************/

type InputKeys = keyof ClosedInputSchema;

type CheckInputKeys = InputKeys extends
  | 'pathParameters'
  | 'body'
  | 'queryStringParameters'
  ? 'pass'
  : 'fail';
const checkInputKeys: CheckInputKeys = 'pass';
checkInputKeys;

type PartialInputKeys = keyof OpenInputSchema;

type CheckPartialInputKeys = PartialInputKeys extends
  | 'pathParameters'
  | 'headers'
  | 'queryStringParameters'
  ? 'pass'
  : 'fail';
const checkPartialInputKeys: CheckPartialInputKeys = 'pass';
checkPartialInputKeys;
