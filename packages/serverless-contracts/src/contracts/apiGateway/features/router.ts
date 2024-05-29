/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Ajv from 'ajv';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
  Handler,
} from 'aws-lambda';
import get from 'lodash/get.js';
import { match } from 'path-to-regexp';

import {
  getApiGatewayHandler,
  GetApiGatewayHandlerOptions,
} from './lambdaHandler';
import { GenericApiGatewayContract } from '../apiGatewayContract';
import { SwarmionApiGatewayHandler } from '../types';

type ApiGatewayProxyHandler = Handler<
  APIGatewayProxyEvent | APIGatewayProxyEventV2
>;

type Consumer<
  Contract extends GenericApiGatewayContract = GenericApiGatewayContract,
> = [Contract, ApiGatewayProxyHandler];

type Match<E> = [Handler<E>, E];

export class SwarmionRouter {
  private consumers: Consumer[] = [];
  private ajv = new Ajv();

  constructor({ ajv }: { ajv?: Ajv } = {}) {
    if (ajv) {
      this.ajv = ajv;
    }
  }

  add<Contract extends GenericApiGatewayContract>(
    contract: Contract,
    options?: Omit<GetApiGatewayHandlerOptions, 'ajv'>,
  ): (handler: SwarmionApiGatewayHandler<Contract>) => void {
    return handler => {
      this.consumers.push([
        contract,
        // @ts-expect-error - This is a valid handler
        getApiGatewayHandler(contract, { ...options, ajv: this.ajv })(handler),
      ]);
    };
  }

  match(
    event: unknown,
  ): Match<APIGatewayProxyEvent | APIGatewayProxyEventV2> | null {
    if (
      !isValidRestApiGatewayEvent(event) &&
      !isValidHttpApiGatewayEvent(event)
    ) {
      return null;
    }
    for (const [contract, handler] of this.consumers) {
      const routerMatch = matchApiGatewayContract(contract, event);
      if (routerMatch === false) {
        continue;
      }

      return [handler, routerMatch];
    }

    return null;
  }
}

export const matchApiGatewayContract = (
  contract: GenericApiGatewayContract,
  event: unknown,
): APIGatewayProxyEvent | APIGatewayProxyEventV2 | false => {
  if (isValidRestApiGatewayEvent(event)) {
    return matchRestApiGatewayContract(contract, event);
  }
  if (isValidHttpApiGatewayEvent(event)) {
    return matchHttpApiGatewayContract(contract, event);
  }

  return false;
};

const matchRestApiGatewayContract = (
  contract: GenericApiGatewayContract,
  event: APIGatewayProxyEventV2,
): APIGatewayProxyEventV2 | false => {
  if (contract.integrationType !== 'restApi') {
    return false;
  }

  return matchHttpRoute({
    contract,
    method: event.requestContext.http.method,
    path: event.rawPath,
    event,
  });
};

const matchHttpApiGatewayContract = (
  contract: GenericApiGatewayContract,
  event: APIGatewayProxyEvent,
): APIGatewayProxyEvent | false => {
  if (contract.integrationType !== 'httpApi') {
    return false;
  }

  return matchHttpRoute({
    contract,
    method: event.requestContext.httpMethod,
    path: event.path,
    event,
  });
};

export const matchHttpRoute = <
  E extends APIGatewayProxyEvent | APIGatewayProxyEventV2,
>({
  contract,
  method,
  path,
  event,
}: {
  contract: GenericApiGatewayContract;
  method: string;
  path: string;
  event: E;
}): E | false => {
  if (method !== contract.method) {
    return false;
  }

  const urlMatch = match<Record<string, string>>(
    contract.path.replaceAll('{', ':').replaceAll('}', ''),
  )(path);

  if (urlMatch === false) {
    return false;
  }

  event.pathParameters = urlMatch.params;

  return event;
};

export const isValidRestApiGatewayEvent = (
  event: any,
): event is APIGatewayProxyEventV2 => {
  return get(event, 'requestContext.http') !== undefined;
};

export const isValidHttpApiGatewayEvent = (
  event: any,
): event is APIGatewayProxyEvent => {
  return get(event, 'requestContext.httpMethod') !== undefined;
};
