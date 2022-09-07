import Ajv from 'ajv';
import createHttpError, { isHttpError } from 'http-errors';

import { ApiGatewayContract } from '../apiGatewayContract';
import {
  ApiGatewayEvent,
  ApiGatewayHandler,
  ApiGatewayResult,
  BodyType,
  HandlerEventType,
  HandlerType,
  OutputType,
} from '../types';

const proxyEventToHandlerEvent = <Contract extends ApiGatewayContract>({
  requestContext,
  body: proxyEventBody = null,
  headers,
  pathParameters,
  queryStringParameters,
}: ApiGatewayEvent<Contract>): HandlerEventType<Contract> => {
  return {
    requestContext,
    body: (proxyEventBody !== null
      ? JSON.parse(proxyEventBody)
      : undefined) as BodyType<Contract>,
    headers,
    pathParameters,
    queryStringParameters,
  } as unknown as HandlerEventType<Contract>;
};

const handlerResponseToLambdaResult = <Contract extends ApiGatewayContract>(
  handlerResponse: OutputType<Contract>,
): ApiGatewayResult<Contract> => ({
  statusCode: 200,
  body: handlerResponse !== undefined ? JSON.stringify(handlerResponse) : '',
});

export const getHandler =
  <Contract extends ApiGatewayContract>(contract: Contract) =>
  (handler: HandlerType<Contract>): ApiGatewayHandler<Contract> =>
  async (event, context, _callback, ...additionalArgs) => {
    // here we decide to not use the callback argument passed by lambda
    // because we have asynchronous handlers
    try {
      const ajv = new Ajv();

      const parsedEvent = proxyEventToHandlerEvent<Contract>(event);

      const inputValidator = ajv.compile(contract.inputSchema);
      if (!inputValidator(parsedEvent)) {
        console.error('Error: Invalid input');
        throw createHttpError(400, 'Invalid input');
      }

      const handlerResponse = await handler(
        parsedEvent,
        context,
        ...additionalArgs,
      );

      if (contract.outputSchema !== undefined) {
        const outputValidator = ajv.compile(contract.outputSchema);
        if (!outputValidator(handlerResponse)) {
          console.error('Error: Invalid output');
          throw createHttpError(400, 'Invalid output');
        }
      }

      return handlerResponseToLambdaResult(handlerResponse);
    } catch (error) {
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
  (handler: HandlerType<typeof contract>): HandlerType<typeof contract> =>
    handler;
