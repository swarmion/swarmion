import {
  BatchResultErrorEntry,
  SendMessageResult,
  SQSClient,
} from '@aws-sdk/client-sqs';
import Ajv from 'ajv';

import { SqsMessage, SqsMessageBodyType } from './common';
import { SQSContract } from '../sqsContract';

export type SendMessageBuilderOptions<Contract extends SQSContract> = (
  | {
      ajv: Ajv;
      validateMessage?: boolean;
    }
  | {
      ajv?: Ajv;
      validateMessage: false;
    }
) & {
  queueUrl: string | (() => string);
  sqsClient: SQSClient;
  bodySerializer?: (body: SqsMessageBodyType<Contract>) => string | undefined; // Use explicit undefined to disable body serialization
};

export type SendMessagesBuilderOptions<Contract extends SQSContract> =
  SendMessageBuilderOptions<Contract> & {
    maxRetries?: number;
    baseDelay?: number;
    throwOnFailedBatch?: boolean;
  };

export type SendMessageSideEffect<Contract extends SQSContract> = (
  message: SqsMessage<Contract>,
) => Promise<SendMessageResult>;

export type SendMessagesSideEffect<Contract extends SQSContract> = (
  messages: SqsMessage<Contract>[],
) => Promise<{ failedItems: BatchResultErrorEntry[] }>;
