import { EventBridgeClient } from '@aws-sdk/client-eventbridge';

import { EventBridgeContract } from '../eventBridgeContract';
import { EventBridgePayloadType } from './common';

export type PutEventBuilderArgs<Contract extends EventBridgeContract> = {
  eventBusName: string;
  source: Contract['sources'][number];
  eventBridgeClient: EventBridgeClient;
};

export type PutEventSideEffect<Contract extends EventBridgeContract> = (
  payload: EventBridgePayloadType<Contract>,
) => Promise<void>;
