import {
  SendMessageBatchCommand,
  SendMessageBatchRequestEntry,
} from '@aws-sdk/client-sqs';
import { BatchResultErrorEntry } from '@aws-sdk/client-sqs/dist-types/models/models_0';
import _PQueue from 'p-queue';

import { chunkEntriesBatch } from '../../../utils';
import { fixESMInteropIssue } from '../../../utils/fixESMInteropIssue';
import { SQSContract } from '../sqsContract';
import { SendMessagesBuilderOptions, SendMessagesSideEffect } from '../types';
import {
  getExponentialBackoffDelay,
  serializeMessage,
  validateMessages,
  wait,
} from '../utils';
const PQueue = fixESMInteropIssue(_PQueue);

export const InfiniteThroughput = 0;

const MAX_BATCH_SIZE = 256_000; // 256Kb
const MAX_BATCH_LENGTH = 10;

const defaultOptions = {
  validateMessage: true,
  bodySerializer: JSON.stringify,
  maxRetries: 3,
  baseDelay: 100,
  throwOnFailedBatch: true,
  throughputCallsPerSecond: InfiniteThroughput,
} satisfies Partial<SendMessagesBuilderOptions<SQSContract>>;

const getThroughputQueueConfig = (
  throughputCallsPerSecond: number,
): { intervalCap: number; interval: number } | Record<string, never> =>
  throughputCallsPerSecond === InfiniteThroughput
    ? {}
    : {
        intervalCap: throughputCallsPerSecond,
        interval: 1000,
      };

const computeMessageSize = (message: SendMessageBatchRequestEntry): number =>
  Buffer.byteLength(JSON.stringify(message), 'utf8'); // This is not accurate must be a good upper approximation

const sendAllMessagesBatchedWithControlledThroughput = async <
  Contract extends SQSContract,
>(
  messages: SendMessageBatchRequestEntry[],
  options: Omit<
    Required<SendMessagesBuilderOptions<Contract>>,
    'ajv' | 'queueUrl'
  > & { queueUrl: string },
): Promise<{ failedItems: BatchResultErrorEntry[] }> => {
  const { sqsClient, queueUrl, throughputCallsPerSecond } = options;
  const queue = new PQueue(getThroughputQueueConfig(throughputCallsPerSecond));

  // Slice events into batches of 10 (max limit for SQS sendMessageBatch) and which size is less than 256KB
  const batches = chunkEntriesBatch({
    entries: messages,
    computeEntrySize: computeMessageSize,
    maxBatchSize: MAX_BATCH_SIZE,
    maxBatchLength: MAX_BATCH_LENGTH,
  });

  const results = await queue.addAll(
    batches.map(
      batch => async () =>
        await sqsClient.send(
          new SendMessageBatchCommand({
            QueueUrl: queueUrl,
            Entries: batch,
          }),
        ),
    ),
  );

  return { failedItems: results.map(({ Failed }) => Failed ?? []).flat() };
};

const sendBatchedMessages = async <Contract extends SQSContract>({
  messages,
  options,
}: {
  messages: SendMessageBatchRequestEntry[];
  options: Omit<Required<SendMessagesBuilderOptions<Contract>>, 'ajv'>;
}): Promise<{ failedItems: BatchResultErrorEntry[] }> => {
  const {
    queueUrl: queueUrlOrGetter,
    baseDelay,
    maxRetries,
    throwOnFailedBatch,
  } = options;
  const queueUrl =
    typeof queueUrlOrGetter === 'string'
      ? queueUrlOrGetter
      : await queueUrlOrGetter();
  let unprocessedMessages: SendMessageBatchRequestEntry[] = messages;
  let failedItems: BatchResultErrorEntry[] = [];
  let attempts = 0;

  do {
    ({ failedItems } =
      await sendAllMessagesBatchedWithControlledThroughput<Contract>(
        unprocessedMessages,
        {
          ...options,
          queueUrl,
        },
      ));

    if (failedItems.length > 0) {
      const failedIds = failedItems.map(({ Id }) => Id);

      unprocessedMessages = messages.filter(({ Id }) => failedIds.includes(Id));
      attempts++;
      console.warn(
        `Attempt ${attempts}: Failed to process ${failedItems.length} items. Retrying after delay...`,
      );

      // Delay before the next attempt with exponential backoff
      if (attempts < maxRetries) {
        const delayDuration = getExponentialBackoffDelay(
          attempts - 1,
          baseDelay,
        );
        console.info(`Delaying for ${delayDuration} ms...`);
        await wait(delayDuration);
      }
    }
  } while (failedItems.length > 0 && attempts < maxRetries);

  if (failedItems.length > 0 && throwOnFailedBatch) {
    console.error('Failed items:', JSON.stringify(failedItems, null, 2));
    throw new Error(
      `Failed to send ${failedItems.length} items to SQS after ${maxRetries} attempts`,
    );
  }

  return { failedItems };
};

/**
 * creates a sendMessages side effect
 * The sendMessages function will send an array of messages to the SQS queue to the full extent of its capabilities:
 * - It validates the messages against the contract
 * - It chunks the array of messages into batches
 * - It retries with exponential backoff the elements of the batches that failed to be sent (if AWS throttles the requests for examples)
 * - By default, it throws an error if one of the message cannot be sent. You can also configure it to return the failed items instead.
 */
export const buildSendMessages =
  <Contract extends SQSContract>(
    contract: Contract,
    options: SendMessagesBuilderOptions<Contract>,
  ): SendMessagesSideEffect<Contract> =>
  async messages => {
    const internalOptions = {
      ...defaultOptions,
      ...options,
    };
    const { bodySerializer } = internalOptions;

    validateMessages<Contract>({
      contract,
      messages,
      options: internalOptions,
    });

    return sendBatchedMessages<Contract>({
      messages: messages.map<SendMessageBatchRequestEntry>(
        serializeMessage<Contract>({ contract, bodySerializer }),
      ),
      options: internalOptions,
    });
  };
