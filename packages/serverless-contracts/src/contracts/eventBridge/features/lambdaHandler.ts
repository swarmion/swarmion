import Ajv, { ValidateFunction } from 'ajv';

import { EventBridgeContract } from '../eventBridgeContract';
import { EventBridgePayloadType } from '../types/common';
import {
  EventBridgeHandler,
  SwarmionEventBridgeHandler,
} from '../types/lambdaHandler';

export type GetEventBridgeHandlerOptions =
  | {
      ajv: Ajv;
      validatePayload?: boolean;
    }
  | {
      ajv?: Ajv;
      validatePayload: false;
    };

const defaultOptions = {
  validatePayload: true,
};

export const getEventBridgeHandler =
  <
    Contract extends EventBridgeContract,
    EventType extends string = Contract['eventType'],
    Payload = EventBridgePayloadType<Contract>,
  >(
    contract: Contract,
    options: GetEventBridgeHandlerOptions,
  ) =>
  <AdditionalArgs extends unknown[] = []>(
    handler: SwarmionEventBridgeHandler<EventType, Payload, AdditionalArgs>,
  ): EventBridgeHandler<EventType, Payload, AdditionalArgs> => {
    const { validatePayload, ajv } = { ...defaultOptions, ...options };

    let payloadValidator: ValidateFunction | undefined = undefined;
    if (validatePayload) {
      payloadValidator = ajv.compile(contract.payloadSchema);
    }

    return async (
      event,
      context,
      callback,
      ...additionalArgs: AdditionalArgs
    ) => {
      if (payloadValidator !== undefined) {
        if (!payloadValidator(event.detail)) {
          console.error('Error: Invalid payload');
          console.error(JSON.stringify(payloadValidator.errors, null, 2));
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
