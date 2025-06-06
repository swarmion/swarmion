import {
  EventBridgeClient,
  PutEventsResultEntry,
} from '@aws-sdk/client-eventbridge';

import { EventBridgePayloadType } from './common';
import { EventBridgeContract } from '../eventBridgeContract';

export type PutEventBuilderArgs<Contract extends EventBridgeContract> = {
  eventBusName: string | (() => string) | (() => Promise<string>);
  source: Contract['sources'][number];
  eventBridgeClient: EventBridgeClient;
  throwOnFailure?: boolean;
};

export type PutEventSideEffect<Contract extends EventBridgeContract> = (
  payload: EventBridgePayloadType<Contract>,
) => Promise<{
  failedEntryCount: number | undefined;
  entry: PutEventsResultEntry | undefined;
}>;
