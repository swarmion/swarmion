import {
  EventBridgeHandler as AwsLambdaEventBridgeHandler,
  Callback,
  Context,
  EventBridgeEvent,
  Handler,
} from 'aws-lambda';

import { EventBridgePayloadType } from './common';
import { EventBridgeContract } from '../eventBridgeContract';

/**
 * The type of a Swarmion handler, with type-inferred event
 * The handler function can define additional arguments
 */
export type SwarmionEventBridgeHandler<
  EventType extends string,
  Payload,
  AdditionalArgs extends unknown[],
> = (
  event: EventBridgeEvent<EventType, Payload>,
  context: Context,
  callback?: Callback,
  ...additionalArgs: AdditionalArgs
) => Promise<unknown>;

export type ContractEventBridgeEvent<Contract extends EventBridgeContract> =
  Contract extends EventBridgeContract
    ? EventBridgeEvent<Contract['eventType'], EventBridgePayloadType<Contract>>
    : never;

export type SwarmionEventBridgeMultipleHandler<
  Events extends EventBridgeEvent<string, unknown>,
  AdditionalArgs extends unknown[],
> = (
  event: Events,
  context: Context,
  callback?: Callback,
  ...additionalArgs: AdditionalArgs
) => Promise<unknown>;

/**
 * a simple helper type to build EventBridgeHandler
 */
type EventBridgeHandlerParameters<
  EventType extends string,
  Payload,
> = Parameters<AwsLambdaEventBridgeHandler<EventType, Payload, unknown>>;

type EventBridgeHandlerMultipleParameters<
  Events extends EventBridgeEvent<string, unknown>,
> = Parameters<Handler<Events, unknown>>;

/**
 * The type of an EventBridge handler. This is the actual version that will
 * be executed by the lambda, not the Swarmion inferred one.
 *
 * See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html.
 */
export type EventBridgeHandler<
  EventType extends string,
  Payload,
  AdditionalArgs extends unknown[],
> = (
  event: EventBridgeHandlerParameters<EventType, Payload>[0],
  context: EventBridgeHandlerParameters<EventType, Payload>[1],
  callback: EventBridgeHandlerParameters<EventType, Payload>[2],
  ...additionalArgs: AdditionalArgs
) => Promise<unknown>;

export type EventBridgeMultipleHandler<
  Events extends EventBridgeEvent<string, unknown>,
  AdditionalArgs extends unknown[],
> = (
  event: EventBridgeHandlerMultipleParameters<Events>[0],
  context: EventBridgeHandlerMultipleParameters<Events>[1],
  callback: EventBridgeHandlerMultipleParameters<Events>[2],
  ...additionalArgs: AdditionalArgs
) => Promise<unknown>;
