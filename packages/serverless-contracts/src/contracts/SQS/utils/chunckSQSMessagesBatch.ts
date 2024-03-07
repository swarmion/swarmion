import { SendMessageBatchRequestEntry } from '@aws-sdk/client-sqs';

type ChunkedMessagesAccumulator = {
  chunkedEntries: SendMessageBatchRequestEntry[][];
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

const computeMessageSize = (message: SendMessageBatchRequestEntry): number =>
  Buffer.byteLength(JSON.stringify(message), 'utf8'); // This is not accurate must be a good upper approximation

export const chunkSQSMessagesBatch = (
  messages: SendMessageBatchRequestEntry[],
): ChunkedMessagesAccumulator['chunkedEntries'] =>
  messages.reduce<ChunkedMessagesAccumulator>(
    (
      chunkedEntriesAccumulator: ChunkedMessagesAccumulator,
      entry: SendMessageBatchRequestEntry,
    ) => {
      const { chunkedEntries, lastChunkSize, lastChunkLength } =
        chunkedEntriesAccumulator;
      const eventSize = computeMessageSize(entry);
      if (eventSize > MAX_BATCH_SIZE) {
        throw new MaxSizeExceededError(
          `Message ${entry.Id} size is ${eventSize}b exceeds the maximum batch size of ${MAX_BATCH_SIZE}b. 
          The whole operation has been cancelled. No message have been sent to SQS.`,
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
