export { EventBridgeContract } from './eventBridgeContract';
export {
  getEventBridgeHandler,
  getMultipleEventBridgeHandler,
  getEventBridgeTrigger,
  buildPutEvent,
  buildPutEvents,
} from './features';

export type {
  EventBridgeHandler,
  SwarmionEventBridgeHandler,
  EventBridgePayloadType,
} from './types';

export type { EventBridgeEvent } from 'aws-lambda';
