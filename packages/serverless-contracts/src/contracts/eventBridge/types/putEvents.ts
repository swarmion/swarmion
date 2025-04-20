import { PutEventsResultEntry } from '@aws-sdk/client-eventbridge';

import { EventBridgePayloadType } from './common';
import { EventBridgeContract } from '../eventBridgeContract';
import { PutEventBuilderArgs } from './putEvent';

export type PutEventsBuilderArgs<Contract extends EventBridgeContract> =
  PutEventBuilderArgs<Contract> & {
    throughputCallsPerSecond?: number;
  };

export type PutEventsSideEffect<Contract extends EventBridgeContract> = (
  payloads: EventBridgePayloadType<Contract>[],
) => Promise<{
  failedEntryCount: number;
  entries: PutEventsResultEntry[];
}>;
