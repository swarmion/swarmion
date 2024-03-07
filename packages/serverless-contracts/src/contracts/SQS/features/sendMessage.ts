import { SendMessageCommand } from '@aws-sdk/client-sqs';
import omit from 'lodash/omit.js';

import { SQSContract } from '../sqsContract';
import { SendMessageBuilderOptions, SendMessageSideEffect } from '../types';
import { serializeMessage, validateMessage } from '../utils';

const defaultOptions = {
  validateMessage: true,
  bodySerializer: JSON.stringify,
} satisfies Partial<SendMessageBuilderOptions<SQSContract>>;

/**
 * creates a sendMessage side effect
 * The sendMessage function validates a message against the contract and sends it to the SQS queue
 */
export const buildSendMessage =
  <Contract extends SQSContract>(
    contract: Contract,
    options: SendMessageBuilderOptions<Contract>,
  ): SendMessageSideEffect<Contract> =>
  async message => {
    const internalOptions = {
      ...defaultOptions,
      ...options,
    };
    const { queueUrl, sqsClient, bodySerializer } = internalOptions;

    validateMessage<Contract>({ contract, message, options: internalOptions });

    const command = new SendMessageCommand({
      QueueUrl: typeof queueUrl === 'string' ? queueUrl : queueUrl(),
      ...omit(
        serializeMessage<Contract>({ contract, bodySerializer })(message),
        'Id',
      ),
    });

    return sqsClient.send(command);
  };
