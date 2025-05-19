import Ajv, { ValidateFunction } from 'ajv';
import type { EventBridgeEvent } from 'aws-lambda';

import { EventBridgeContract } from '../eventBridgeContract';
import {
  ContractEventBridgeEvent,
  EventBridgeMultipleHandler,
  SwarmionEventBridgeMultipleHandler,
} from '../types/lambdaHandler';

export type GetMultipleEventBridgeHandlerOptions =
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

export const getMultipleEventBridgeHandler =
  <
    Contracts extends EventBridgeContract[],
    Events extends EventBridgeEvent<string, unknown> = ContractEventBridgeEvent<
      Contracts[number]
    >,
  >(
    contracts: Contracts,
    options: GetMultipleEventBridgeHandlerOptions,
  ) =>
  <AdditionalArgs extends unknown[] = []>(
    handler: SwarmionEventBridgeMultipleHandler<Events, AdditionalArgs>,
  ): EventBridgeMultipleHandler<Events, AdditionalArgs> => {
    const { validatePayload, ajv } = { ...defaultOptions, ...options };

    let payloadValidator: ValidateFunction | undefined = undefined;
    if (validatePayload) {
      payloadValidator = ajv.compile({
        oneOf: contracts.map(contract => contract.payloadSchema),
      });
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
