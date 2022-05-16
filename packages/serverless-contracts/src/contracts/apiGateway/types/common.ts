import { FromSchema, JSONSchema } from 'json-schema-to-ts';

import { ConstrainedJSONSchema } from '../../../types/constrainedJSONSchema';
import { ApiGatewayContract } from '../apiGatewayContract';

/**
 * The integration type: HTTP API or REST API
 * For more information, see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html
 */
export type ApiGatewayIntegrationType = 'httpApi' | 'restApi';
export type ApiGatewayKey = 'httpApi' | 'http';

export type PathParametersType<Contract extends ApiGatewayContract> =
  Contract['pathParametersSchema'] extends ConstrainedJSONSchema
    ? FromSchema<Contract['pathParametersSchema']>
    : undefined;
export type QueryStringParametersType<Contract extends ApiGatewayContract> =
  Contract['queryStringParametersSchema'] extends ConstrainedJSONSchema
    ? FromSchema<Contract['queryStringParametersSchema']>
    : undefined;
export type HeadersType<Contract extends ApiGatewayContract> =
  Contract['headersSchema'] extends ConstrainedJSONSchema
    ? FromSchema<Contract['headersSchema']>
    : undefined;
export type BodyType<Contract extends ApiGatewayContract> =
  Contract['bodySchema'] extends ConstrainedJSONSchema
    ? FromSchema<Contract['bodySchema']>
    : undefined;

export type OutputType<Contract extends ApiGatewayContract> =
  Contract['outputSchema'] extends JSONSchema
    ? FromSchema<Contract['outputSchema']>
    : undefined;
