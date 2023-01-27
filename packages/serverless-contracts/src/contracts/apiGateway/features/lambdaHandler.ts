import Ajv from 'ajv';
import createHttpError, { isHttpError } from 'http-errors';

import { GenericApiGatewayContract } from '../apiGatewayContract';
import {
  ApiGatewayHandler,
  BodyType,
  CustomRequestContextType,
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
    Contract extends GenericApiGatewayContract,
    IntegrationType extends ApiGatewayIntegrationType = Contract['integrationType'],
    AuthorizerType extends ApiGatewayAuthorizerType = Contract['authorizerType'],
    PathParameters = PathParametersType<Contract>,
    QueryStringParameters = QueryStringParametersType<Contract>,
    Headers = HeadersType<Contract>,
    CustomRequestContext = CustomRequestContextType<Contract>,
    Body = BodyType<Contract>,
    Output = OutputType<Contract>,
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
      CustomRequestContext,
      Body,
      Output,
      AdditionalArgs
    >,
  ): ApiGatewayHandler<
    IntegrationType,
    AuthorizerType,
    Output,
    AdditionalArgs
  > => {
    const ajv = new Ajv();
    const inputValidator = ajv.compile(contract.inputSchema);

    const outputValidator =
      contract.outputSchema !== undefined
        ? ajv.compile(contract.outputSchema)
        : undefined;

    return async (event, context, callback, ...additionalArgs) => {
      try {
        const parsedEvent = proxyEventToHandlerEvent<
          IntegrationType,
          AuthorizerType,
          PathParameters,
          QueryStringParameters,
          Headers,
          CustomRequestContext,
          Body
        >(event);

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

        if (outputValidator !== undefined) {
          if (!outputValidator(handlerResponse)) {
            console.error('Error: Invalid output');
            console.error(outputValidator.errors);
            throw createHttpError(400, 'Invalid output');
          }
        }

        return handlerResponseToProxyResult<IntegrationType, Output>(
          handlerResponse,
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
          statusCode: 500,
          body: 'Internal server error',
        };
      }
    };
  };

/**
 * A wrapper to get the proper typing for a lambda handler.
 * This does not include parsing and validation.
 *
 * Use `getHandler` for a more advanced usage
 */
export const getLambdaHandler =
  <
    Contract extends GenericApiGatewayContract,
    IntegrationType extends ApiGatewayIntegrationType = Contract['integrationType'],
    AuthorizerType extends ApiGatewayAuthorizerType = Contract['authorizerType'],
    PathParameters = PathParametersType<Contract>,
    QueryStringParameters = QueryStringParametersType<Contract>,
    Headers = HeadersType<Contract>,
    CustomRequestContext = CustomRequestContextType<Contract>,
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
      CustomRequestContext,
      Body,
      Output
    >,
  ): InternalSwarmionApiGatewayHandler<
    IntegrationType,
    AuthorizerType,
    PathParameters,
    QueryStringParameters,
    Headers,
    CustomRequestContext,
    Body,
    Output
  > =>
    handler;
