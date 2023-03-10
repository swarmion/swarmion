import { JSONSchema } from 'json-schema-to-ts';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { HttpMethod, HttpStatusCodes } from 'types/http';

import { ConstrainedZodJsonSchema, ZodJsonSchema } from '../../types';
import { ApiGatewayAuthorizerType, ApiGatewayIntegrationType } from './types';

/**
 * ApiGatewayContract:
 *
 * a contract used to define a type-safe interaction between AWS Services through Api Gateway.
 *
 * Main features:
 * - input and output dynamic validation with JSONSchemas on both end of the contract;
 * - type inference for both input and output;
 * - generation of a contract document that can be checked for breaking changes;
 * - generation of open api documentation
 */
export class ApiGatewayContract<
  Path extends string = string,
  Method extends HttpMethod = HttpMethod,
  IntegrationType extends ApiGatewayIntegrationType = ApiGatewayIntegrationType,
  AuthorizerType extends ApiGatewayAuthorizerType = undefined,
  PathParametersSchema extends ConstrainedZodJsonSchema | undefined = undefined,
  QueryStringParametersSchema extends ConstrainedZodJsonSchema | undefined =
    | undefined,
  HeadersSchema extends ConstrainedZodJsonSchema | undefined = undefined,
  RequestContextSchema extends ZodJsonSchema | undefined = undefined,
  BodySchema extends ZodJsonSchema | undefined = undefined,
  PropsOutputSchemas extends
    | Partial<Record<HttpStatusCodes, ZodJsonSchema>>
    | undefined = undefined,
  OutputSchemas = Exclude<PropsOutputSchemas, undefined>,
> {
  public contractType = 'apiGateway' as const;
  public id: string;
  public path: Path;
  public method: Method;
  public integrationType: IntegrationType;
  public authorizerType: AuthorizerType;
  public pathParametersSchema: PathParametersSchema;
  public queryStringParametersSchema: QueryStringParametersSchema;
  public headersSchema: HeadersSchema;
  public requestContextSchema: RequestContextSchema;
  public bodySchema: BodySchema;
  public outputSchemas: OutputSchemas;
  public inputSchema: ZodJsonSchema;
  public inputJsonSchema: JSONSchema;

  /**
   * Builds a new ApiGateway contract
   *
   * @param props - the contract properties
   */
  constructor(props: {
    /**
     * An id to uniquely identify the contract among services. Beware of uniqueness!
     */
    id: string;
    /**
     * The path on which the lambda will be triggered
     */
    path: Path;
    /**
     * The http method
     */
    method: Method;
    /**
     * `'httpApi'` or `'restApi'`, see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html
     */
    integrationType: IntegrationType;
    /**
     * Indicates which type of authorizer is used for this contract.
     */
    authorizerType?: AuthorizerType;
    /**
     * A JSONSchema used to validate the path parameters and infer their types.
     *
     * Please note that the `as const` directive is necessary to properly infer the type from the schema.
     * See https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
     */
    pathParametersSchema?: PathParametersSchema;
    /**
     * A JSONSchema used to validate the query parameters and infer their types.
     *
     * Please note that the `as const` directive is necessary to properly infer the type from the schema.
     * See https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
     */
    queryStringParametersSchema?: QueryStringParametersSchema;
    /**
     * A JSONSchema used to validate the headers and infer their types.
     *
     * Please note that the `as const` directive is necessary to properly infer the type from the schema.
     * See https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
     */
    headersSchema?: HeadersSchema;
    /**
     * A JSONSchema used to validate the requestContext and infer its type.
     *
     * Please note that the `as const` directive is necessary to properly infer the type from the schema.
     * See https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
     */
    requestContextSchema?: RequestContextSchema;
    /**
     * A JSONSchema used to validate the body and infer its type.
     *
     * Please note that the `as const` directive is necessary to properly infer the type from the schema.
     * See https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
     */
    bodySchema?: BodySchema;
    /**
     * A record of JSONSchemas used to validate different outputs and infer their types depending on the return status code.
     *
     * Please note that the `as const` directive is necessary to properly infer the type from the schema.
     * See https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
     */
    outputSchemas?: PropsOutputSchemas;
  }) {
    this.id = props.id;
    this.path = props.path;
    this.method = props.method;
    this.integrationType = props.integrationType;
    this.authorizerType = (props.authorizerType ?? undefined) as AuthorizerType;
    this.pathParametersSchema = (props.pathParametersSchema ??
      undefined) as PathParametersSchema;
    this.queryStringParametersSchema = (props.queryStringParametersSchema ??
      undefined) as QueryStringParametersSchema;
    this.headersSchema = (props.headersSchema ?? undefined) as HeadersSchema;
    this.requestContextSchema = (props.requestContextSchema ??
      undefined) as RequestContextSchema;
    this.bodySchema = (props.bodySchema ?? undefined) as BodySchema;
    this.outputSchemas = (
      props.outputSchemas !== undefined ? props.outputSchemas : {}
    ) as OutputSchemas;
    this.inputSchema = this.getInputSchema();
    // @ts-ignore remove this when zod-to-json-schema will be fixed
    this.inputJsonSchema = {
      ...zodToJsonSchema(this.inputSchema),
      additionalProperties: true,
    };
  }

  private getInputSchema(): ZodJsonSchema {
    const properties = omitBy(
      {
        pathParameters: this.pathParametersSchema,
        queryStringParameters: this.queryStringParametersSchema,
        headers: this.headersSchema,
        requestContext: this.requestContextSchema,
        body: this.bodySchema,
      } as const,
      isUndefined,
    ) as Record<string, ZodJsonSchema>;

    return z.object(properties);
  }
}

/**
 * The type of an ApiGateway contract using all default types.
 *
 * It is used internally to type contract features input
 */
export type GenericApiGatewayContract = ApiGatewayContract<
  string,
  HttpMethod,
  ApiGatewayIntegrationType,
  ApiGatewayAuthorizerType,
  ConstrainedZodJsonSchema | undefined,
  ConstrainedZodJsonSchema | undefined,
  ConstrainedZodJsonSchema | undefined,
  ZodJsonSchema | undefined,
  ZodJsonSchema | undefined,
  Partial<Record<HttpStatusCodes, ZodJsonSchema>>
>;
