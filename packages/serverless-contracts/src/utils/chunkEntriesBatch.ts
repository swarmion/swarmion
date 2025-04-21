export class MaxSizeExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MaxSizeExceededError';
  }
}
type ChunkedEntriesAccumulator<EntryType> = {
  chunkedEntries: EntryType[][];
  lastChunkSize: number;
  lastChunkLength: number;
};
export const chunkEntriesBatch = <EntryType>({
  entries,
  computeEntrySize,
  maxBatchSize,
  maxBatchLength,
}: {
  entries: EntryType[];
  computeEntrySize: (entry: EntryType) => number;
  maxBatchSize: number;
  maxBatchLength: number;
}): EntryType[][] =>
  entries.reduce<ChunkedEntriesAccumulator<EntryType>>(
    (chunkedEntriesAccumulator, entry, index) => {
      const { chunkedEntries, lastChunkSize, lastChunkLength } =
        chunkedEntriesAccumulator;
      const entrySize = computeEntrySize(entry);
      if (entrySize > maxBatchSize) {
        throw new MaxSizeExceededError(
          `Entry ${index} size is ${entrySize}b exceeds the maximum batch size of ${maxBatchSize}b. 
          The whole operation has been cancelled.`,
        );
      }

      if (
        lastChunkSize + entrySize > maxBatchSize ||
        lastChunkLength === maxBatchLength
      ) {
        return {
          chunkedEntries: [...chunkedEntries, [entry]],
          lastChunkSize: entrySize,
          lastChunkLength: 1,
        };
      }

      const lastChunk = chunkedEntries.pop() ?? [];

      return {
        chunkedEntries: [...chunkedEntries, [...lastChunk, entry]],
        lastChunkSize: lastChunkSize + entrySize,
        lastChunkLength: lastChunkLength + 1,
      };
    },
    {
      chunkedEntries: [],
      lastChunkSize: 0,
      lastChunkLength: 0,
    },
  ).chunkedEntries;
