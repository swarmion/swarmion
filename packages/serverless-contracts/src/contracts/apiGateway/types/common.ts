import { FromSchema, JSONSchema } from 'json-schema-to-ts';
import { O } from 'ts-toolbelt';

import { ConstrainedJSONSchema } from 'types/constrainedJSONSchema';

import { GenericApiGatewayContract } from '../apiGatewayContract';

export type PathParametersType<Contract extends GenericApiGatewayContract> =
  Contract['pathParametersSchema'] extends ConstrainedJSONSchema
    ? FromSchema<Contract['pathParametersSchema']>
    : undefined;

export type QueryStringParametersType<
  Contract extends GenericApiGatewayContract,
> = Contract['queryStringParametersSchema'] extends ConstrainedJSONSchema
  ? FromSchema<Contract['queryStringParametersSchema']>
  : undefined;

export type HeadersType<Contract extends GenericApiGatewayContract> =
  Contract['headersSchema'] extends ConstrainedJSONSchema
    ? FromSchema<Contract['headersSchema']>
    : undefined;

export type BodyType<Contract extends GenericApiGatewayContract> =
  Contract['bodySchema'] extends JSONSchema
    ? FromSchema<Contract['bodySchema']>
    : undefined;

export type OutputsType<Contract extends GenericApiGatewayContract> = {
  [StatusCode in keyof Contract['outputSchemas']]: {
    statusCode: StatusCode;
    body: Contract['outputSchemas'][StatusCode] extends JSONSchema
      ? FromSchema<Contract['outputSchemas'][StatusCode]>
      : void;
  };
};

export type OutputType<Contract extends GenericApiGatewayContract> = O.UnionOf<
  OutputsType<Contract>
>;
