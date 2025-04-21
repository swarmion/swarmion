import {
  PutEventsCommand,
  PutEventsRequestEntry,
  PutEventsResultEntry,
} from '@aws-sdk/client-eventbridge';
import _PQueue from 'p-queue';

import { chunkEntriesBatch } from '../../../utils';
import { fixESMInteropIssue } from '../../../utils/fixESMInteropIssue';
import { EventBridgeContract } from '../eventBridgeContract';
import { PutEventsBuilderArgs, PutEventsSideEffect } from '../types/putEvents';

const PQueue = fixESMInteropIssue(_PQueue);

const MAX_BATCH_SIZE = 256_000; // 256Kb
const MAX_BATCH_LENGTH = 10;

const defaultOptions = {
  throughputCallsPerSecond: 400, // Minimal default throughput. Some regions can have up to 10_000. See: https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-quota.html
  throwOnFailure: true,
};

const OneSecondInMillis = 1000;
const getThroughputQueueConfig = (
  throughputCallsPerSecond: number,
): { intervalCap: number; interval: number } => ({
  intervalCap: throughputCallsPerSecond,
  interval: OneSecondInMillis,
});

/** Sum all values of the event */
const computeEventSize = (event: PutEventsRequestEntry): number => {
  let size = 0;

  if (event.Time) {
    size += 14;
  }
  if (event.Detail) {
    size += Buffer.byteLength(event.Detail, 'utf8');
  }
  if (event.DetailType) {
    size += Buffer.byteLength(event.DetailType, 'utf8');
  }
  if (event.Source) {
    size += Buffer.byteLength(event.Source, 'utf8');
  }
  if (event.Resources) {
    event.Resources.forEach(resource => Buffer.byteLength(resource, 'utf8'));
  }

  return size;
};

const sendAllEventsBatchedWithControlledThroughput = async <
  Contract extends EventBridgeContract,
>(
  events: PutEventsRequestEntry[],
  options: Required<PutEventsBuilderArgs<Contract>>,
): Promise<{
  failedEntryCount: number;
  entries: PutEventsResultEntry[];
}> => {
  const { eventBridgeClient, throughputCallsPerSecond } = options;
  const queue = new PQueue(getThroughputQueueConfig(throughputCallsPerSecond));

  // Slice events into batches of 10 (max limit for EventBridge PutEventsCommand) and which size is less than 256KB
  const batches = chunkEntriesBatch({
    entries: events,
    computeEntrySize: computeEventSize,
    maxBatchSize: MAX_BATCH_SIZE,
    maxBatchLength: MAX_BATCH_LENGTH,
  });

  const results = await queue.addAll(
    batches.map(
      batch => async () =>
        await eventBridgeClient.send(
          new PutEventsCommand({
            Entries: batch,
          }),
        ),
    ),
  );

  return {
    failedEntryCount: results.reduce(
      (sum, { FailedEntryCount }) => sum + (FailedEntryCount ?? 0),
      0,
    ),
    entries: results.map(({ Entries }) => Entries ?? []).flat(),
  };
};

export const buildPutEvents =
  <Contract extends EventBridgeContract>(
    contract: Contract,
    args: PutEventsBuilderArgs<Contract>,
  ): PutEventsSideEffect<Contract> =>
  async payloads => {
    const argsWithDefaults = {
      ...defaultOptions,
      ...args,
    };
    const {
      source,
      eventBusName: eventBusNameGetter,
      throwOnFailure,
    } = argsWithDefaults;
    const eventBusName =
      typeof eventBusNameGetter === 'string'
        ? eventBusNameGetter
        : await eventBusNameGetter();

    const events = payloads.map<PutEventsRequestEntry>(payload => ({
      Detail: JSON.stringify(payload),
      DetailType: contract.eventType,
      Source: source,
      EventBusName: eventBusName,
    }));

    const { failedEntryCount, entries } =
      await sendAllEventsBatchedWithControlledThroughput(
        events,
        argsWithDefaults,
      );

    if (failedEntryCount > 0 && throwOnFailure) {
      entries.forEach(entry => {
        if (entry.ErrorCode) {
          console.error(
            `Failed to send event. Error: ${entry.ErrorMessage} (${entry.ErrorCode})`,
          );
        }
      });
      throw new Error(`Failed to send ${failedEntryCount} events.`);
    }

    return { failedEntryCount, entries };
  };
