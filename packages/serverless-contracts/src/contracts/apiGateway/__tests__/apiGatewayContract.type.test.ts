import { A } from 'ts-toolbelt';

import { createApiGatewayContract } from 'contracts';
import { OutputType } from 'contracts/apiGateway/types/common';
import { StatusCodes } from 'types/http';

import { GenericApiGatewayContract } from '../apiGatewayContract';

export const pathParametersSchema = {
  type: 'object',
  properties: { userId: { type: 'string' }, pageNumber: { type: 'string' } },
  required: ['userId', 'pageNumber'],
  additionalProperties: false,
} as const;

export const queryStringParametersSchema = {
  type: 'object',
  properties: { testId: { type: 'string' } },
  required: ['testId'],
  additionalProperties: false,
} as const;

export const headersSchema = {
  type: 'object',
  properties: { myHeader: { type: 'string' } },
  required: ['myHeader'],
} as const;

export const bodySchema = {
  type: 'object',
  properties: { foo: { type: 'string' } },
  required: ['foo'],
} as const;

export const outputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
  },
  required: ['id', 'name'],
  additionalProperties: false,
} as const;

export const errorOutputSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
  },
  required: ['message'],
  additionalProperties: false,
} as const;

export const httpApiGatewayContract = createApiGatewayContract({
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
    [StatusCodes.OK]: outputSchema,
  },
});

type ContractCheck =
  typeof httpApiGatewayContract extends GenericApiGatewayContract
    ? 'pass'
    : 'fail';
const contractCheck: ContractCheck = 'pass';
contractCheck;

export const httpApiGatewayContract2 = createApiGatewayContract({
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
    [StatusCodes.OK]: outputSchema,
    [StatusCodes.BAD_REQUEST]: errorOutputSchema,
  },
});

type ContractOutputType = OutputType<typeof httpApiGatewayContract2>;

type OutputCheck = A.Equals<
  ContractOutputType,
  | {
      statusCode: StatusCodes.OK;
      body: { id: string; name: string };
    }
  | {
      statusCode: StatusCodes.BAD_REQUEST;
      body: { message: string };
    }
>;

const outputCheck: OutputCheck = 1;
outputCheck;
