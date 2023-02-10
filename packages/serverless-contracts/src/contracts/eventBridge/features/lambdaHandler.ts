import Ajv from 'ajv';

import { EventBridgeContract } from '../eventBridgeContract';
import { EventBridgePayloadType } from '../types/common';
import {
  EventBridgeHandler,
  SwarmionEventBridgeHandler,
} from '../types/lambdaHandler';

export interface GetEventBridgeHandlerOptions {
  validatePayload: boolean;
}

const defaultOptions: GetEventBridgeHandlerOptions = {
  validatePayload: true,
};

export const getEventBridgeHandler =
  <
    Contract extends EventBridgeContract,
    EventType extends string = Contract['eventType'],
    Payload = EventBridgePayloadType<Contract>,
  >(
    contract: Contract,
    options?: Partial<GetEventBridgeHandlerOptions>,
  ) =>
  <AdditionalArgs extends unknown[] = []>(
    handler: SwarmionEventBridgeHandler<EventType, Payload, AdditionalArgs>,
  ): EventBridgeHandler<EventType, Payload, AdditionalArgs> => {
    const { validatePayload } = { ...defaultOptions, ...options };

    const ajv = new Ajv();
    const payloadValidator = ajv.compile(contract.payloadSchema);

    return async (
      event,
      context,
      callback,
      ...additionalArgs: AdditionalArgs
    ) => {
      if (validatePayload) {
        if (!payloadValidator(event.detail)) {
          console.error('Error: Invalid payload');
          console.error(payloadValidator.errors);
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
