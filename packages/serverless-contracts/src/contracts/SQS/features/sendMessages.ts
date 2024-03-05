import {
  SendMessageBatchCommand,
  SendMessageBatchRequestEntry,
} from '@aws-sdk/client-sqs';
import { BatchResultErrorEntry } from '@aws-sdk/client-sqs/dist-types/models/models_0';

import { SQSContract } from '../sqsContract';
import { SendMessagesBuilderOptions, SendMessagesSideEffect } from '../types';
import {
  chunkSQSMessagesBatch,
  getExponentialBackoffDelay,
  serializeMessage,
  validateMessages,
  wait,
} from '../utils';

const defaultOptions = {
  validateMessage: true,
  bodySerializer: JSON.stringify,
  maxRetries: 3,
  baseDelay: 100,
  throwOnFailedBatch: true,
} satisfies Partial<SendMessagesBuilderOptions<SQSContract>>;

const sendOneBatch = async <Contract extends SQSContract>(
  batch: SendMessageBatchRequestEntry[],
  options: Omit<
    Required<SendMessagesBuilderOptions<Contract>>,
    'ajv' | 'queueUrl'
  > & { queueUrl: string },
): Promise<{ failedItems: BatchResultErrorEntry[] }> => {
  const { sqsClient, queueUrl, maxRetries, baseDelay } = options;

  let unprocessedItems: SendMessageBatchRequestEntry[] = batch;
  let attempts = 0;
  let failedItems: BatchResultErrorEntry[] = [];

  do {
    const { Failed } = await sqsClient.send(
      new SendMessageBatchCommand({
        QueueUrl: queueUrl,
        Entries: unprocessedItems,
      }),
    );
    failedItems = Failed ?? [];

    if (failedItems.length > 0) {
      attempts++;
      console.warn(
        `Attempt ${attempts}: Failed to process ${failedItems.length} items. Retrying after delay...`,
      );

      const failedIds = failedItems.map(({ Id }) => Id);

      // Retry only the failed items
      unprocessedItems = unprocessedItems.filter(({ Id }) =>
        failedIds.includes(Id),
      );

      // Delay before the next attempt - exponential backoff
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

  return { failedItems };
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
    maxRetries,
    throwOnFailedBatch,
  } = options;
  const queueUrl =
    typeof queueUrlOrGetter === 'string'
      ? queueUrlOrGetter
      : queueUrlOrGetter();
  const failedItems: BatchResultErrorEntry[] = [];

  // Slice events into batches of 10 (max limit for SQS sendMessageBatch) and which size is less than 256KB
  const batches = chunkSQSMessagesBatch(messages);

  // do not parallelize this loop, as it will cause throttling for FIFO queues
  for (const batch of batches) {
    const { failedItems: batchFailedItems } = await sendOneBatch<Contract>(
      batch,
      {
        ...options,
        queueUrl,
      },
    );
    failedItems.push(...batchFailedItems);
  }

  if (failedItems.length > 0 && throwOnFailedBatch) {
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
