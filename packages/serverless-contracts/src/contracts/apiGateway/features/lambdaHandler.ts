import { ApiGatewayContract } from '../apiGatewayContract';
import { HandlerType } from '../types';

export const getLambdaHandler =
  <Contract extends ApiGatewayContract>(contract: Contract) =>
  (handler: HandlerType<typeof contract>): HandlerType<typeof contract> =>
    handler;
