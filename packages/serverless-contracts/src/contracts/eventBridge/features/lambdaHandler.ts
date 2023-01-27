import Ajv from 'ajv';

import { EventBridgeContract } from '../eventBridgeContract';
import { EventBridgePayloadType } from '../types/common';
import {
  EventBridgeHandler,
  SwarmionEventBridgeHandler,
} from '../types/lambdaHandler';

export const getEventBridgeHandler =
  <
    Contract extends EventBridgeContract,
    EventType extends string = Contract['eventType'],
    Payload = EventBridgePayloadType<Contract>,
  >(
    contract: Contract,
  ) =>
  <AdditionalArgs extends unknown[] = []>(
    handler: SwarmionEventBridgeHandler<EventType, Payload, AdditionalArgs>,
  ): EventBridgeHandler<EventType, Payload, AdditionalArgs> => {
    const ajv = new Ajv();
    const payloadValidator = ajv.compile(contract.payloadSchema);

    return async (
      event,
      context,
      callback,
      ...additionalArgs: AdditionalArgs
    ) => {
      if (!payloadValidator(event.detail)) {
        console.error('Error: Invalid payload');
        console.error(payloadValidator.errors);
        throw new Error('Invalid payload');
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
