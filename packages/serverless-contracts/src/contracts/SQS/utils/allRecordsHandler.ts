import type { SQSBatchResponse } from 'aws-lambda/trigger/sqs';

import {
  SQSHandlerParameters,
  SwarmionSQSHandler,
  SwarmionSQSRecord,
} from '../types';

export const getAllRecordsHandler =
  <MessageBody, MessageAttributes, AdditionalArgs extends unknown[]>(
    handleRecord: SwarmionSQSHandler<
      MessageBody,
      MessageAttributes,
      AdditionalArgs
    >,
    context: SQSHandlerParameters[1],
    callback: SQSHandlerParameters[2],
    additionalArgs: AdditionalArgs,
  ) =>
  async (event: {
    Records: SwarmionSQSRecord<MessageBody, MessageAttributes>[];
  }): Promise<SQSBatchResponse> => {
    const { Records } = event;

    const handleRecordsResults = await Promise.allSettled(
      Records.map(record =>
        handleRecord(record, context, callback, ...additionalArgs),
      ),
    );

    const recordsErrors = handleRecordsResults
      .map((recordResult, index) => ({
        ...recordResult,
        record: Records[index],
      }))
      .filter(
        (
          record,
        ): record is PromiseRejectedResult & {
          record: SwarmionSQSRecord<MessageBody, MessageAttributes>;
        } => record.status === 'rejected',
      );

    recordsErrors.forEach(({ record, reason }) => {
      console.error(
        `Error during the processing of the message ${record.messageId}`,
        { record },
        reason,
      );
      console.error(
        `Message ${record.messageId} will be marked as failed and be retried according to the SQS retry configuration`,
      );
    });

    return {
      batchItemFailures: recordsErrors.map(({ record: { messageId } }) => ({
        itemIdentifier: messageId,
      })),
    };
  };
