import {
  EventBridgeHandler as AwsLambdaEventBridgeHandler,
  Context,
  EventBridgeEvent,
} from 'aws-lambda';

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
  ...additionalArgs: AdditionalArgs
) => Promise<unknown>;

/**
 * a simple helper type to build EventBridgeHandler
 */
type EventBridgeHandlerParameters<
  EventType extends string,
  Payload,
> = Parameters<AwsLambdaEventBridgeHandler<EventType, Payload, unknown>>;

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
