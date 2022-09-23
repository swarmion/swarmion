import { Context, EventBridgeEvent, EventBridgeHandler } from 'aws-lambda';

import { EventBridgeContract } from '../eventBridgeContract';
import { PayloadType } from './common';

export type HandlerType<Contract extends EventBridgeContract> = (
  event: HandlerEventType<Contract>,
  context: Context,
  ...additionalArgs: never[]
) => Promise<unknown>;

type HandlerEventType<Contract extends EventBridgeContract> = EventBridgeEvent<
  Contract['eventType'],
  PayloadType<Contract>
>;

export type EventBridgeHandlerType<Contract extends EventBridgeContract> =
  EventBridgeHandler<Contract['eventType'], PayloadType<Contract>, unknown>;
