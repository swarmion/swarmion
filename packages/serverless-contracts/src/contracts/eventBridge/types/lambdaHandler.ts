import { Context, EventBridgeEvent, EventBridgeHandler } from 'aws-lambda';

import { EventBridgeContract } from '../eventBridgeContract';
import { PayloadType } from './common';

export type HandlerType<
  Contract extends EventBridgeContract,
  AdditionalArgs extends never[] = never[],
> = (
  event: HandlerEventType<Contract>,
  context: Context,
  ...additionalArgs: AdditionalArgs
) => Promise<unknown>;

type HandlerEventType<Contract extends EventBridgeContract> = EventBridgeEvent<
  Contract['eventType'],
  PayloadType<Contract>
>;

type EventBridgeHandlerParameters<Contract extends EventBridgeContract> =
  Parameters<
    EventBridgeHandler<Contract['eventType'], PayloadType<Contract>, unknown>
  >;

export type EventBridgeHandlerType<
  Contract extends EventBridgeContract,
  AdditionalArgs extends never[] = never[],
> = (
  event: EventBridgeHandlerParameters<Contract>[0],
  context: EventBridgeHandlerParameters<Contract>[1],
  callback: EventBridgeHandlerParameters<Contract>[2],
  ...additionalArgs: AdditionalArgs
) => Promise<unknown>;
