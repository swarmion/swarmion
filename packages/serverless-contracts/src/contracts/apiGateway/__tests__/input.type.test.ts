import { FromSchema, JSONSchema } from 'json-schema-to-ts';
import { A } from 'ts-toolbelt';

import {
  bodySchema,
  headersSchema,
  httpApiGatewayContractMock,
  pathParametersSchema,
  queryStringParametersSchema,
} from '../__mocks__/httpApiGatewayContract';
import { AllInputProperties, InputSchemaType } from '../types';
import { DefinedProperties } from '../types/utils';

/******************* INSTANTIATE Schemas ****************/

type ClosedInputSchema = InputSchemaType<
  typeof pathParametersSchema,
  typeof queryStringParametersSchema,
  undefined,
  typeof bodySchema,
  false
>;

type OpenInputSchema = InputSchemaType<
  typeof pathParametersSchema,
  typeof queryStringParametersSchema,
  typeof headersSchema,
  undefined,
  true
>;

/******************* Check they extend JSONSchema ****************/

type CheckClosedExtendsJSONSchema = ClosedInputSchema extends JSONSchema
  ? 'pass'
  : 'fail';
const checkClosedExtendsJSONSchema: CheckClosedExtendsJSONSchema = 'pass';
checkClosedExtendsJSONSchema;

type CheckOpenExtendsJSONSchema = OpenInputSchema extends JSONSchema
  ? 'pass'
  : 'fail';
const checkOpenExtendsJSONSchema: CheckOpenExtendsJSONSchema = 'pass';
checkOpenExtendsJSONSchema;

/******************* Check the resolution with FromSchema ****************/

type ResolvedClosedInput = FromSchema<ClosedInputSchema>;
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

type CheckClosedResolved = A.Equals<ResolvedClosedInput, ExpectedClosedInput>;

const checkClosedResolved: CheckClosedResolved = 1;
checkClosedResolved;

type ResolvedOpenInput = FromSchema<OpenInputSchema>;
type ExpectedOpenInput = {
  [x: string]: unknown;
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

type CheckOpenResolved = A.Equals<ResolvedOpenInput, ExpectedOpenInput>;

const checkOpenResolved: CheckOpenResolved = 1;
checkOpenResolved;

/******************* Check the resolution with FromSchema ****************/

type InputKeys = (keyof DefinedProperties<
  AllInputProperties<
    typeof httpApiGatewayContractMock['pathParametersSchema'],
    typeof httpApiGatewayContractMock['queryStringParametersSchema'],
    typeof httpApiGatewayContractMock['headersSchema'],
    typeof httpApiGatewayContractMock['bodySchema']
  >
>)[];

type CheckInputKeys = InputKeys extends string[] ? 'pass' : 'fail';
const checkInputKeys: CheckInputKeys = 'pass';
checkInputKeys;
