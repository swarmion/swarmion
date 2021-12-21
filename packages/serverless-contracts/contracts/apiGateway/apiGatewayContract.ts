/* eslint-disable max-lines */
import { AxiosInstance, AxiosResponse } from 'axios';
import { FromSchema, JSONSchema } from 'json-schema-to-ts';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';

import { ConstrainedJSONSchema } from 'types/constrainedJSONSchema';
import { GenericContract } from 'types/genericContract';
import { HttpMethod } from 'types/http';
import { fillPathTemplate } from 'utils/fillPathTemplate';

import { ApiGatewayLambdaConfigType } from './lambdaTrigger';
import {
  ApiGatewayIntegrationType,
  ApiGatewayLambdaCompleteTriggerType,
  ApiGatewayLambdaSimpleTriggerType,
  ApiGatewayTriggerKey,
  DefinedProperties,
  FullContractSchemaType,
  InputSchemaType,
  RequestParameters,
} from './types';

/**
 * ApiGatewayContract:
 *
 * a contract used to define a type-safe interaction between AWS Services through Api Gateway.
 *
 * Main features:
 * - input and output dynamic validation with JSONSchemas on both end of the contract;
 * - type inference for both input and output;
 * - generation of a contract document that can be checked for breaking changes;
 */
export class ApiGatewayContract<
  Path extends string,
  Method extends HttpMethod,
  IntegrationType extends ApiGatewayIntegrationType,
  PathParametersSchema extends ConstrainedJSONSchema | undefined,
  QueryStringParametersSchema extends ConstrainedJSONSchema | undefined,
  HeadersSchema extends ConstrainedJSONSchema | undefined,
  BodySchema extends JSONSchema | undefined,
  OutputSchema extends JSONSchema | undefined,
  PathParametersType = PathParametersSchema extends ConstrainedJSONSchema
    ? FromSchema<PathParametersSchema>
    : undefined,
  QueryStringParametersType = QueryStringParametersSchema extends ConstrainedJSONSchema
    ? FromSchema<QueryStringParametersSchema>
    : undefined,
  HeadersType = HeadersSchema extends ConstrainedJSONSchema
    ? FromSchema<HeadersSchema>
    : undefined,
  BodyType = BodySchema extends JSONSchema ? FromSchema<BodySchema> : undefined,
  OutputType = OutputSchema extends JSONSchema
    ? FromSchema<OutputSchema>
    : undefined,
> implements GenericContract
{
  private _id: string;
  private _path: Path;
  private _method: Method;
  private _integrationType: IntegrationType;
  private _pathParametersSchema: PathParametersSchema;
  private _queryStringParametersSchema: QueryStringParametersSchema;
  private _headersSchema: HeadersSchema;
  private _bodySchema: BodySchema;
  private _outputSchema: OutputSchema;

  /**
   * Builds a new ApiGateway contract
   *
   * @param id an id to uniquely identify the contract among services. Beware of unicity!
   * @param path the path on which the lambda will be triggered
   * @param method the http method
   * @param integrationType httpApi or restApi, see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html
   * @param pathParametersSchema a JSONSchema used to validate the path parameters and infer their types.
   * Please note that the `as const` directive is necessary to properly infer the type from the schema.
   * See https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
   * Also please note that for Typescript reasons, you need to explicitely pass `undefined` if you don't want to use the schema.
   * @param queryStringParametersSchema a JSONSchema used to validate the query parameters and infer their types (Same constraints).
   * @param headersSchema a JSONSchema used to validate the headers and infer their types (Same constraints).
   * @param bodySchema a JSONSchema used to validate the body and infer its type (Same constraints).
   * @param outputSchema a JSONSchema used to validate the output and infer its type (Same constraints).
   */
  constructor({
    id,
    path,
    method,
    integrationType,
    pathParametersSchema,
    queryStringParametersSchema,
    headersSchema,
    bodySchema,
    outputSchema,
  }: {
    id: string;
    path: Path;
    method: Method;
    integrationType: IntegrationType;
    pathParametersSchema: PathParametersSchema;
    queryStringParametersSchema: QueryStringParametersSchema;
    headersSchema: HeadersSchema;
    bodySchema: BodySchema;
    outputSchema: OutputSchema;
  }) {
    this._id = id;
    this._path = path;
    this._method = method;
    this._integrationType = integrationType;
    this._pathParametersSchema = pathParametersSchema;
    this._queryStringParametersSchema = queryStringParametersSchema;
    this._headersSchema = headersSchema;
    this._bodySchema = bodySchema;
    this._outputSchema = outputSchema;
  }

  /**
   * Returns the lambda trigger
   */
  get trigger(): ApiGatewayLambdaSimpleTriggerType<
    ApiGatewayTriggerKey<IntegrationType>
  > {
    const key = this._integrationType === 'httpApi' ? 'httpApi' : 'http';

    // @ts-ignore somehow the type inference does not work here
    return { [key]: { path: this._path, method: this._method } };
  }

  getCompleteTrigger(
    additionalConfig: ApiGatewayLambdaConfigType<
      ApiGatewayTriggerKey<IntegrationType>
    >,
  ): ApiGatewayLambdaCompleteTriggerType<
    ApiGatewayTriggerKey<IntegrationType>
  > {
    const key = this._integrationType === 'httpApi' ? 'httpApi' : 'http';

    // @ts-ignore somehow the type inference does not work here
    return {
      [key]: { ...additionalConfig, path: this._path, method: this._method },
    };
  }

  /**
   * Returns the aggregated input schema in order to validate the inputs of lambdas.
   *
   * This also enables to infer the type with `json-schema-to-ts`.
   */
  get inputSchema(): InputSchemaType<
    PathParametersSchema,
    QueryStringParametersSchema,
    HeadersSchema,
    BodySchema
  > {
    const properties = omitBy(
      {
        pathParameters: this._pathParametersSchema,
        queryStringParameters: this._queryStringParametersSchema,
        headers: this._headersSchema,
        body: this._bodySchema,
      } as const,
      isUndefined,
    );

    return {
      type: 'object',
      properties,
      // @ts-ignore here object.keys is not precise enough
      required: Object.keys(properties),
    };
  }

  /**
   * Returns the aggregated output schema in order to validate the outputs of lambdas.
   *
   * This also enables to infer the type with `json-schema-to-ts`.
   */
  get outputSchema(): OutputSchema {
    return this._outputSchema;
  }

  get contractId(): string {
    return this._id;
  }

  /**
   * Returns the aggregated contract schema in order to validate the inputs of lambdas.
   *
   * This also enables to infer the type with `json-schema-to-ts`.
   */
  get fullContractSchema(): FullContractSchemaType<
    Path,
    Method,
    IntegrationType,
    PathParametersSchema,
    QueryStringParametersSchema,
    HeadersSchema,
    BodySchema,
    OutputSchema
  > {
    const properties = {
      contractId: { const: this._id },
      contractType: { const: this._integrationType },
      path: { const: this._path },
      method: { const: this._method },
      ...omitBy(
        {
          pathParameters: this._pathParametersSchema,
          queryStringParameters: this._queryStringParametersSchema,
          headers: this._headersSchema,
          body: this._bodySchema,
          output: this._outputSchema,
        },
        isUndefined,
      ),
    };

    return {
      type: 'object',
      // @ts-ignore type inference does not work here
      properties,
      // @ts-ignore type inference does not work here
      required: Object.keys(properties),
    };
  }

  /**
   * Build the parameters necessary to call the request on the client-side
   *
   * @param pathParameters its type matches `FromSchema<typeof pathParametersSchema>`
   * @param queryStringParameters its type matches `FromSchema<typeof queryStringParametersSchema>`
   * @param headers its type matches `FromSchema<typeof headersSchema>`
   * @param body its type matches `FromSchema<typeof headersSchema>`
   *
   * @returns the request parameters to be used on the client-side
   */
  getRequestParameters(
    requestArguments: DefinedProperties<{
      pathParameters: PathParametersType;
      queryStringParameters: QueryStringParametersType;
      headers: HeadersType;
      body: BodyType;
    }>,
  ): RequestParameters<BodyType> {
    // TODO improve inner typing here
    const { pathParameters, queryStringParameters, headers, body } =
      requestArguments as {
        pathParameters: Record<string, string>;
        queryStringParameters: Record<string, string>;
        headers: Record<string, string>;
        body: BodyType;
      };

    const path =
      typeof pathParameters !== 'undefined'
        ? fillPathTemplate(this._path, pathParameters)
        : this._path;

    return omitBy(
      {
        method: this._method,
        path,
        body,
        queryStringParameters,
        headers,
      },
      isUndefined,
    ) as RequestParameters<BodyType>;
  }

  /**
   * @param axiosClient axios client used to make the request
   * @param requestArguments see `getRequestParameters`
   * @returns a promise with the response
   */
  async axiosRequest(
    axiosClient: AxiosInstance,
    requestArguments: DefinedProperties<{
      pathParameters: PathParametersType;
      queryStringParameters: QueryStringParametersType;
      headers: HeadersType;
      body: BodyType;
    }>,
  ): Promise<AxiosResponse<OutputType>> {
    const { path, method, queryStringParameters, body, headers } =
      this.getRequestParameters(requestArguments);

    return await axiosClient.request({
      method,
      url: path,
      headers,
      data: body,
      params: queryStringParameters,
    });
  }
}
