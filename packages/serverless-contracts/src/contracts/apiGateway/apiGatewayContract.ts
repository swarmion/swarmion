import { JSONSchema } from 'json-schema-to-ts';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';

import { ConstrainedJSONSchema } from 'types/constrainedJSONSchema';
import { HttpMethod, StatusCodes } from 'types/http';

import {
  ApiGatewayAuthorizerType,
  ApiGatewayIntegrationType,
} from './types/constants';

export type ApiGatewayContract<
  Path extends string,
  Method extends HttpMethod,
  IntegrationType extends ApiGatewayIntegrationType,
  AuthorizerType extends ApiGatewayAuthorizerType,
  PathParametersSchema extends ConstrainedJSONSchema | undefined,
  QueryStringParametersSchema extends ConstrainedJSONSchema | undefined,
  HeadersSchema extends ConstrainedJSONSchema | undefined,
  BodySchema extends JSONSchema | undefined,
  OutputSchemas extends Partial<Record<StatusCodes, JSONSchema>> | undefined,
> = {
  contractType: 'apiGateway';
  id: string;
  path: Path;
  method: Method;
  integrationType: IntegrationType;
  authorizerType: AuthorizerType;
  pathParametersSchema: PathParametersSchema;
  queryStringParametersSchema: QueryStringParametersSchema;
  headersSchema: HeadersSchema;
  bodySchema: BodySchema;
  outputSchemas: OutputSchemas;
};

export type GenericApiGatewayContract = ApiGatewayContract<
  string,
  HttpMethod,
  ApiGatewayIntegrationType,
  ApiGatewayAuthorizerType,
  ConstrainedJSONSchema | undefined,
  ConstrainedJSONSchema | undefined,
  ConstrainedJSONSchema | undefined,
  JSONSchema | undefined,
  Partial<Record<StatusCodes, JSONSchema>> | undefined
>;

export const createApiGatewayContract = <
  Path extends string,
  Method extends HttpMethod,
  IntegrationType extends ApiGatewayIntegrationType,
  AuthorizerType extends ApiGatewayAuthorizerType = undefined,
  PathParametersSchema extends ConstrainedJSONSchema | undefined = undefined,
  QueryStringParametersSchema extends ConstrainedJSONSchema | undefined =
    | undefined,
  HeadersSchema extends ConstrainedJSONSchema | undefined = undefined,
  BodySchema extends JSONSchema | undefined = undefined,
  OutputSchemas extends
    | Partial<Record<StatusCodes, JSONSchema>>
    | undefined = undefined,
>(props: {
  id: string;
  path: Path;
  method: Method;
  integrationType: IntegrationType;
  authorizerType?: AuthorizerType;
  pathParametersSchema?: PathParametersSchema;
  queryStringParametersSchema?: QueryStringParametersSchema;
  headersSchema?: HeadersSchema;
  bodySchema?: BodySchema;
  outputSchemas?: OutputSchemas;
}): ApiGatewayContract<
  Path,
  HttpMethod,
  IntegrationType,
  AuthorizerType,
  PathParametersSchema,
  QueryStringParametersSchema,
  HeadersSchema,
  BodySchema,
  OutputSchemas
> => ({
  contractType: 'apiGateway',
  id: props.id,
  path: props.path,
  method: props.method,
  integrationType: props.integrationType,
  authorizerType: props.authorizerType as AuthorizerType,
  pathParametersSchema: props.pathParametersSchema as PathParametersSchema,
  queryStringParametersSchema:
    props.queryStringParametersSchema as QueryStringParametersSchema,
  headersSchema: props.headersSchema as HeadersSchema,
  bodySchema: props.bodySchema as BodySchema,
  outputSchemas: props.outputSchemas as OutputSchemas,
});

export const getInputSchema = <Contract extends GenericApiGatewayContract>(
  contract: Contract,
): JSONSchema => {
  const properties = omitBy(
    {
      pathParameters: contract.pathParametersSchema,
      queryStringParameters: contract.queryStringParametersSchema,
      headers: contract.headersSchema,
      body: contract.bodySchema,
    } as const,
    isUndefined,
  );

  return {
    type: 'object',
    properties,
    required: Object.keys(properties),
    additionalProperties: true,
  } as unknown as JSONSchema;
};
