import Ajv from 'ajv';
import createHttpError, { isHttpError } from 'http-errors';

import { StatusCodes } from 'types/http';

import { ApiGatewayContract } from '../apiGatewayContract';
import {
  ApiGatewayHandler,
  BodyType,
  HeadersType,
  InternalSwarmionApiGatewayHandler,
  OutputType,
  PathParametersType,
  QueryStringParametersType,
} from '../types';
import {
  ApiGatewayAuthorizerType,
  ApiGatewayIntegrationType,
} from '../types/constants';
import {
  handlerResponseToProxyResult,
  proxyEventToHandlerEvent,
} from '../utils';

export const getApiGatewayHandler =
  <
    Contract extends ApiGatewayContract,
    IntegrationType extends ApiGatewayIntegrationType = Contract['integrationType'],
    AuthorizerType extends ApiGatewayAuthorizerType = Contract['authorizerType'],
    PathParameters = PathParametersType<Contract>,
    QueryStringParameters = QueryStringParametersType<Contract>,
    Headers = HeadersType<Contract>,
    Body = BodyType<Contract>,
    Output extends {
      statusCode: number | string | symbol;
      body: unknown;
    } = OutputType<Contract>,
  >(
    contract: Contract,
  ) =>
  <AdditionalArgs extends unknown[] = never[]>(
    handler: InternalSwarmionApiGatewayHandler<
      IntegrationType,
      AuthorizerType,
      PathParameters,
      QueryStringParameters,
      Headers,
      Body,
      Output,
      AdditionalArgs
    >,
  ): ApiGatewayHandler<
    IntegrationType,
    AuthorizerType,
    Output,
    AdditionalArgs
  > =>
  async (event, context, callback, ...additionalArgs) => {
    try {
      const ajv = new Ajv();

      const parsedEvent = proxyEventToHandlerEvent<
        IntegrationType,
        AuthorizerType,
        PathParameters,
        QueryStringParameters,
        Headers,
        Body
      >(event);

      const inputValidator = ajv.compile(contract.inputSchema);
      if (!inputValidator(parsedEvent)) {
        console.error('Error: Invalid input');
        console.error(inputValidator.errors);
        throw createHttpError(400, 'Invalid input');
      }

      const handlerResponse = await handler(
        parsedEvent,
        context,
        callback,
        ...additionalArgs,
      );

      const outputSchema =
        contract.outputSchemas[handlerResponse.statusCode as StatusCodes];

      if (outputSchema !== undefined) {
        const outputValidator = ajv.compile(outputSchema);
        if (!outputValidator(handlerResponse.body)) {
          console.error('Error: Invalid output');
          console.error(outputValidator.errors);
          throw createHttpError(400, 'Invalid output');
        }
      }

      return handlerResponseToProxyResult<IntegrationType, Output>(
        handlerResponse.statusCode as StatusCodes,
        handlerResponse.body,
      );
    } catch (error) {
      console.error(error);

      if (isHttpError(error) && error.expose) {
        return {
          headers: error.headers,
          statusCode: error.statusCode,
          body: error.message,
        };
      }

      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: 'Internal server error',
      };
    }
  };

/**
 * A wrapper to get the proper typing for a lambda handler.
 * This does not include parsing and validation.
 *
 * Use `getHandler` for a more advanced usage
 */
export const getLambdaHandler =
  <
    Contract extends ApiGatewayContract,
    IntegrationType extends ApiGatewayIntegrationType = Contract['integrationType'],
    AuthorizerType extends ApiGatewayAuthorizerType = Contract['authorizerType'],
    PathParameters = PathParametersType<Contract>,
    QueryStringParameters = QueryStringParametersType<Contract>,
    Headers = HeadersType<Contract>,
    Body = BodyType<Contract>,
    Output = OutputType<Contract>,
  >(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _contract: Contract,
  ) =>
  (
    handler: InternalSwarmionApiGatewayHandler<
      IntegrationType,
      AuthorizerType,
      PathParameters,
      QueryStringParameters,
      Headers,
      Body,
      Output
    >,
  ): InternalSwarmionApiGatewayHandler<
    IntegrationType,
    AuthorizerType,
    PathParameters,
    QueryStringParameters,
    Headers,
    Body,
    Output
  > =>
    handler;
