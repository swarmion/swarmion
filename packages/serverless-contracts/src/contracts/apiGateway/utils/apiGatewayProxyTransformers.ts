import { ApiGatewayContract } from '../apiGatewayContract';
import {
  ApiGatewayEvent,
  ApiGatewayResult,
  BodyType,
  HandlerEventType,
  OutputType,
} from '../types';

export const proxyEventToHandlerEvent = <Contract extends ApiGatewayContract>({
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
    queryStringParameters: queryStringParameters ?? {},
  } as unknown as HandlerEventType<Contract>;
};

export const handlerResponseToProxyResult = <
  Contract extends ApiGatewayContract,
>(
  handlerResponse: OutputType<Contract>,
): ApiGatewayResult<Contract> => ({
  statusCode: 200,
  body: handlerResponse !== undefined ? JSON.stringify(handlerResponse) : '',
  headers:
    handlerResponse !== undefined
      ? { 'Content-Type': 'application/json' }
      : undefined,
});
