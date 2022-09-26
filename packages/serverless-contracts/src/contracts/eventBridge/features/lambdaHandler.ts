import Ajv from 'ajv';

import { EventBridgeContract } from '../eventBridgeContract';
import { PayloadType } from '../types/common';
import { EventBridgeHandlerType, HandlerType } from '../types/lambdaHandler';

export const getHandler =
  <
    Contract extends EventBridgeContract,
    EventType extends string = Contract['eventType'],
    Payload = PayloadType<Contract>,
  >(
    contract: Contract,
  ) =>
  <AdditionalArgs extends unknown[] = []>(
    handler: HandlerType<EventType, Payload, AdditionalArgs>,
  ): EventBridgeHandlerType<EventType, Payload, AdditionalArgs> =>
  async (event, context, _callback, ...additionalArgs: AdditionalArgs) => {
    // here we decide to not use the callback argument passed by lambda
    // because we have asynchronous handlers
    const ajv = new Ajv();

    const payloadValidator = ajv.compile(contract.payloadSchema);
    if (!payloadValidator(event.detail)) {
      console.error('Error: Invalid payload');
      throw new Error('Invalid payload');
    }

    const handlerResponse = await handler(event, context, ...additionalArgs);

    return handlerResponse;
  };
