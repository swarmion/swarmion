import Ajv, { ValidateFunction } from 'ajv';
import createHttpError, { isHttpError } from 'http-errors';

import { HttpStatusCodes } from 'types/http';

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

export interface GetApiGatewayHandlerOptions {
  validateInput?: boolean;
  validateOutput?: boolean;
}

const defaultOptions: GetApiGatewayHandlerOptions = {
  validateInput: true,
  validateOutput: true,
};

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
    Output extends {
      statusCode: number | string | symbol;
      body: unknown;
    } = OutputType<Contract>,
  >(
    contract: Contract,
    options?: Partial<GetApiGatewayHandlerOptions>,
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
    const { validateInput, validateOutput } = {
      ...defaultOptions,
      ...options,
    };

    const { inputSchema, outputSchemas } = contract;

    let inputValidator: ValidateFunction | undefined = undefined;
    const outputValidators: Record<string, ValidateFunction | undefined> = {};

    if (validateInput === true || validateOutput === true) {
      const ajv = new Ajv({ keywords: ['faker'] });

      if (validateInput === true) {
        inputValidator = ajv.compile(inputSchema);
      }

      if (validateOutput === true) {
        Object.keys(outputSchemas).forEach(statusCode => {
          const outputSchema =
            outputSchemas[statusCode as unknown as keyof typeof outputSchemas];

          outputValidators[statusCode] =
            outputSchema !== undefined ? ajv.compile(outputSchema) : undefined;
        });
      }
    }

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

        if (inputValidator !== undefined) {
          if (!inputValidator(parsedEvent)) {
            console.error('Error: Invalid input');
            console.error(inputValidator.errors);
            throw createHttpError(400, 'Invalid input');
          }
        }

        const handlerResponse = await handler(
          parsedEvent,
          context,
          callback,
          ...additionalArgs,
        );

        const outputValidator =
          outputValidators[handlerResponse.statusCode as HttpStatusCodes];

        if (outputValidator !== undefined) {
          if (!outputValidator(handlerResponse.body)) {
            console.error('Error: Invalid output');
            console.error(outputValidator.errors);
            throw createHttpError(400, 'Invalid output');
          }
        }

        return handlerResponseToProxyResult<IntegrationType, Output>(
          handlerResponse.statusCode as HttpStatusCodes,
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
          statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
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
    Handler = InternalSwarmionApiGatewayHandler<
      IntegrationType,
      AuthorizerType,
      PathParameters,
      QueryStringParameters,
      Headers,
      CustomRequestContext,
      Body,
      Output
    >,
  >(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _contract: Contract,
  ) =>
  (handler: Handler): Handler =>
    handler;
