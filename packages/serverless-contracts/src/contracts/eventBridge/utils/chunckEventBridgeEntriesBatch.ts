import { PutEventsRequestEntry } from '@aws-sdk/client-eventbridge';

type ChunkedEventsAccumulator = {
  chunkedEntries: PutEventsRequestEntry[][];
  lastChunkSize: number;
  lastChunkLength: number;
};

const MAX_BATCH_SIZE = 256000; // 256Kb
const MAX_BATCH_LENGTH = 10;

export class MaxSizeExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MaxSizeExceededError';
  }
}

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

export const chunkEventBridgeEventsBatch = (
  events: PutEventsRequestEntry[],
): ChunkedEventsAccumulator['chunkedEntries'] =>
  events.reduce<ChunkedEventsAccumulator>(
    (
      chunkedEntriesAccumulator: ChunkedEventsAccumulator,
      entry: PutEventsRequestEntry,
      index: number,
    ) => {
      const { chunkedEntries, lastChunkSize, lastChunkLength } =
        chunkedEntriesAccumulator;
      const eventSize = computeEventSize(entry);
      if (eventSize > MAX_BATCH_SIZE) {
        throw new MaxSizeExceededError(
          `Message ${index} size is ${eventSize}b exceeds the maximum batch size of ${MAX_BATCH_SIZE}b. 
          The whole operation has been cancelled. No event have been sent to EventBridge.`,
        );
      }

      if (
        lastChunkSize + eventSize > MAX_BATCH_SIZE ||
        lastChunkLength === MAX_BATCH_LENGTH
      ) {
        return {
          chunkedEntries: [...chunkedEntries, [entry]],
          lastChunkSize: eventSize,
          lastChunkLength: 1,
        };
      }

      const lastChunk = chunkedEntries.pop() ?? [];

      return {
        chunkedEntries: [...chunkedEntries, [...lastChunk, entry]],
        lastChunkSize: lastChunkSize + eventSize,
        lastChunkLength: lastChunkLength + 1,
      };
    },
    {
      chunkedEntries: [],
      lastChunkSize: 0,
      lastChunkLength: 0,
    },
  ).chunkedEntries;
