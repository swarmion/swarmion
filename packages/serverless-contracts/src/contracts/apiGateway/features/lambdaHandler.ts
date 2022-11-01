import Ajv from 'ajv';
import createHttpError, { isHttpError } from 'http-errors';

import { ApiGatewayContract } from '../apiGatewayContract';
import { ApiGatewayHandler, SwarmionApiGatewayHandler } from '../types';
import {
  handlerResponseToProxyResult,
  proxyEventToHandlerEvent,
} from '../utils';

export const getApiGatewayHandler =
  <Contract extends ApiGatewayContract>(contract: Contract) =>
  (handler: SwarmionApiGatewayHandler<Contract>): ApiGatewayHandler<Contract> =>
  async (event, context, callback, ...additionalArgs) => {
    try {
      const ajv = new Ajv();

      const parsedEvent = proxyEventToHandlerEvent<Contract>(event);

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

      if (contract.outputSchema !== undefined) {
        const outputValidator = ajv.compile(contract.outputSchema);
        if (!outputValidator(handlerResponse)) {
          console.error('Error: Invalid output');
          console.error(outputValidator.errors);
          throw createHttpError(400, 'Invalid output');
        }
      }

      return handlerResponseToProxyResult(handlerResponse);
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

/**
 * A wrapper to get the proper typing for a lambda handler.
 * This does not include parsing and validation.
 *
 * Use `getHandler` for a more advanced usage
 */
export const getLambdaHandler =
  <Contract extends ApiGatewayContract>(contract: Contract) =>
  (
    handler: SwarmionApiGatewayHandler<typeof contract>,
  ): SwarmionApiGatewayHandler<typeof contract> =>
    handler;
