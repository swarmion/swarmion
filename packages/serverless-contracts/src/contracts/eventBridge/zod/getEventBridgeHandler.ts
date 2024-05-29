import {
  EventBridgeHandler as AwsLambdaEventBridgeHandler,
  Callback,
  Context,
  EventBridgeEvent,
} from 'aws-lambda';
import { z, ZodSchema } from 'zod';

import { EventBridgeContract } from './EventBridgeContract';
import { EventBridgePayloadType } from './EventBridgePayloadType';

/**
 * The type of a Swarmion handler, with type-inferred event
 * The handler function can define additional arguments
 */
type SwarmionEventBridgeHandler<
  EventType extends string,
  Payload,
  AdditionalArgs extends unknown[],
> = (
  event: EventBridgeEvent<EventType, Payload>,
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

/**
 * The type of an EventBridge handler. This is the actual version that will
 * be executed by the lambda, not the Swarmion inferred one.
 *
 * See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html.
 */
type EventBridgeHandler<
  EventType extends string,
  Payload,
  AdditionalArgs extends unknown[],
> = (
  event: EventBridgeHandlerParameters<EventType, Payload>[0],
  context: EventBridgeHandlerParameters<EventType, Payload>[1],
  callback: EventBridgeHandlerParameters<EventType, Payload>[2],
  ...additionalArgs: AdditionalArgs
) => Promise<unknown>;

export type GetEventBridgeHandlerOptions = {
  validatePayload?: boolean;
};

const defaultOptions = {
  validatePayload: true,
};

export const getEventBridgeHandler =
  <
    Contracts extends readonly EventBridgeContract[],
    EventType extends string = Contracts[number]['eventType'],
    Payload = EventBridgePayloadType<Contracts[number]>,
  >(
    contracts: Contracts,
    options: GetEventBridgeHandlerOptions,
  ) =>
  <AdditionalArgs extends unknown[] = []>(
    handler: SwarmionEventBridgeHandler<EventType, Payload, AdditionalArgs>,
  ): EventBridgeHandler<EventType, Payload, AdditionalArgs> => {
    const { validatePayload } = { ...defaultOptions, ...options };

    let finalSchema: ZodSchema;

    if (contracts.length === 0) {
      throw new Error('Invalid empty contracts');
    }

    const [schema0, schema1, ...restSchemas] = contracts.map(
      c => c.payloadSchema,
    );

    if (contracts.length === 1 && schema0 !== undefined) {
      finalSchema = schema0;
    } else if (
      contracts.length > 1 &&
      schema0 !== undefined &&
      schema1 !== undefined
    ) {
      finalSchema = z.union([schema0, schema1, ...restSchemas]);
    }

    let payloadValidator: typeof finalSchema.safeParse | undefined = undefined;
    if (validatePayload) {
      payloadValidator = (input: unknown) => finalSchema.safeParse(input);
    }

    return async (
      event,
      context,
      callback,
      ...additionalArgs: AdditionalArgs
    ) => {
      if (payloadValidator !== undefined) {
        const validatorResult = payloadValidator(event.detail);
        if (!validatorResult.success) {
          console.error('Error: Invalid payload');
          console.error(JSON.stringify(validatorResult.error, null, 2));
          throw new Error('Invalid payload');
        }
      }

      const handlerResponse = await handler(
        event,
        context,
        callback,
        ...additionalArgs,
      );

      return handlerResponse;
    };
  };
