import { FromSchema, JSONSchema } from 'json-schema-to-ts';

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

export type OutputType<Contract extends GenericApiGatewayContract> =
  Contract['outputSchema'] extends JSONSchema
    ? FromSchema<Contract['outputSchema']>
    : void;
