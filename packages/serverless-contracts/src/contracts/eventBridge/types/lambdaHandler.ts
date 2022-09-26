import { Context, EventBridgeEvent, EventBridgeHandler } from 'aws-lambda';

export type HandlerType<
  EventType extends string,
  Payload,
  AdditionalArgs extends unknown[],
> = (
  event: EventBridgeEvent<EventType, Payload>,
  context: Context,
  ...additionalArgs: AdditionalArgs
) => Promise<unknown>;

type EventBridgeHandlerParameters<
  EventType extends string,
  Payload,
> = Parameters<EventBridgeHandler<EventType, Payload, unknown>>;

export type EventBridgeHandlerType<
  EventType extends string,
  Payload,
  AdditionalArgs extends unknown[],
> = (
  event: EventBridgeHandlerParameters<EventType, Payload>[0],
  context: EventBridgeHandlerParameters<EventType, Payload>[1],
  callback: EventBridgeHandlerParameters<EventType, Payload>[2],
  ...additionalArgs: AdditionalArgs
) => Promise<unknown>;
