import { SendMessageCommand } from '@aws-sdk/client-sqs';

import { SQSContract } from '../sqsContract';
import {
  SendMessageBuilderOptions,
  SendMessageSideEffect,
  SqsMessage,
} from '../types';
import {
  getBodyValidator,
  getMessageAttributesValidator,
  serializeMessageAttributes,
} from '../utils';

const defaultOptions = {
  validateMessage: true,
  bodySerializer: JSON.stringify,
} satisfies Partial<SendMessageBuilderOptions<SQSContract>>;

const validateMessage = <Contract extends SQSContract>({
  contract,
  message,
  options,
}: {
  contract: Contract;
  message: SqsMessage<Contract>;
  options: SendMessageBuilderOptions<Contract>;
}) => {
  const { body, messageAttributes } = message;

  const bodyValidator = getBodyValidator<Contract>(contract, options);
  if (bodyValidator !== undefined && !bodyValidator(body)) {
    console.error('Error: Invalid message body');
    console.error(JSON.stringify(bodyValidator.errors, null, 2));
    throw new Error('Error: Invalid message body');
  }

  const messageAttributesValidator = getMessageAttributesValidator<Contract>(
    contract,
    options,
  );
  if (
    messageAttributesValidator !== undefined &&
    !messageAttributesValidator(messageAttributes)
  ) {
    console.error('Error: Invalid message attributes');
    console.error(JSON.stringify(messageAttributesValidator.errors, null, 2));
    throw new Error('Error: Invalid message attributes');
  }
};

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
    const { body, messageAttributes, ...restMessage } = message;

    validateMessage<Contract>({ contract, message, options: internalOptions });

    const command = new SendMessageCommand({
      MessageBody:
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- bodySerializer can be undefined if explicitly set to undefined in the options
        bodySerializer !== undefined ? JSON.stringify(body) : (body as string),
      QueueUrl: typeof queueUrl === 'string' ? queueUrl : queueUrl(),
      ...(messageAttributes !== undefined && messageAttributes !== null
        ? {
            MessageAttributes: serializeMessageAttributes(
              messageAttributes as Record<string, unknown>, // messageAttributes generic infered type has {} as type. I don't know why
              contract,
            ),
          }
        : {}),
      ...restMessage,
    });

    await sqsClient.send(command);
  };
