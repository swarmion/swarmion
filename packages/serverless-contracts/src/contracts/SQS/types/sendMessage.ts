import { SQSClient } from '@aws-sdk/client-sqs';
import Ajv from 'ajv';

import { SqsMessage, SqsMessageBodyType } from './common';
import { SQSContract } from '../sqsContract';

export type SendMessageBuilderOptions<Contract extends SQSContract> =
  | {
      queueUrl: string | (() => string);
      sqsClient: SQSClient;
      ajv: Ajv;
      validateMessage?: boolean;
      bodySerializer?: (
        body: SqsMessageBodyType<Contract>,
      ) => string | undefined; // Use explicit undefined to disable body serialization
    }
  | {
      queueUrl: string | (() => string);
      sqsClient: SQSClient;
      ajv?: Ajv;
      validateMessage: false;
      bodySerializer?: (
        body: SqsMessageBodyType<Contract>,
      ) => string | undefined; // Use explicit undefined to disable body serialization
    };

export type SendMessageSideEffect<Contract extends SQSContract> = (
  message: SqsMessage<Contract>,
) => Promise<void>;
