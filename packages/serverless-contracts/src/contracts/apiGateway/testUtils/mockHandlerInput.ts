import { Context } from 'aws-lambda';
import { JSONSchemaFaker, Schema } from 'json-schema-faker';
import seedrandom from 'seedrandom';

import {
  getAPIGatewayEventRequestContextMock,
  getAPIGatewayV2EventRequestContextMock,
} from '@swarmion/serverless-helpers';

import { deepMerge } from './utils/deepMerge';
import { GenericApiGatewayContract } from '../apiGatewayContract';
import {
  ApiGatewayEvent,
  BodyType,
  CustomRequestContextType,
  HandlerCallback,
  HandlerEventType,
  HeadersType,
  PathParametersType,
  QueryStringParametersType,
} from '../types';
import {
  ApiGatewayAuthorizerType,
  ApiGatewayIntegrationType,
} from '../types/constants';
import { getHandlerContextMock } from '../utils/mockHandlerContext';

let seed = 'MySuperSwarmionSeed';

export const setMockHandlerInputSeed = (inputSeed: string): void => {
  seed = inputSeed;
};

export const getMockHandlerInput = <
  Contract extends GenericApiGatewayContract,
  IntegrationType extends
    ApiGatewayIntegrationType = Contract['integrationType'],
  AuthorizerType extends ApiGatewayAuthorizerType = Contract['authorizerType'],
  AdditionalArgs extends unknown[] = never[],
  CustomEvent = HandlerEventType<
    IntegrationType,
    AuthorizerType,
    PathParametersType<Contract>,
    QueryStringParametersType<Contract>,
    HeadersType<Contract>,
    CustomRequestContextType<Contract>,
    BodyType<Contract>
  >,
  Event = ApiGatewayEvent<IntegrationType, AuthorizerType>,
  Callback = HandlerCallback<IntegrationType>,
>(
  contract: Contract,
  partialEvent: Partial<CustomEvent> = {},
  ...additionalArgs: AdditionalArgs
): [Event, Context, Callback, ...AdditionalArgs] => {
  JSONSchemaFaker.option({ random: seedrandom(seed) });

  const defaultBody = getFakerDefault(contract.bodySchema as Schema);

  const defaultPathParameters = getFakerDefault(
    contract.pathParametersSchema as Schema,
  );

  const defaultQueryStringParameters = getFakerDefault(
    contract.queryStringParametersSchema as Schema,
  );

  const defaultHeaders = getFakerDefault(contract.headersSchema as Schema);

  const defaultRequestContext =
    contract.integrationType === 'restApi'
      ? getAPIGatewayEventRequestContextMock()
      : getAPIGatewayV2EventRequestContextMock();

  const defaultCustomRequestContext =
    getFakerDefault(contract.requestContextSchema as Schema) ?? {};

  const defaultEvent = {
    pathParameters: defaultPathParameters,
    queryStringParameters: defaultQueryStringParameters,
    headers: defaultHeaders,
    body: defaultBody,
    requestContext: deepMerge(
      defaultRequestContext,
      defaultCustomRequestContext,
    ),
  };

  const event = deepMerge(defaultEvent, partialEvent);

  const stringifiedEvent = {
    ...event,
    body: event.body !== undefined ? JSON.stringify(event.body) : undefined,
  };

  return [
    stringifiedEvent as Event,
    getHandlerContextMock(),
    (() => null) as Callback,
    ...additionalArgs,
  ];
};

const getFakerDefault = (schema?: Schema) =>
  schema !== undefined ? JSONSchemaFaker.generate(schema) : undefined;
