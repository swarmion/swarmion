import {
  getBodyValidator,
  getMessageAttributesValidator,
} from './getRecordsValidator';
import { SQSContract } from '../sqsContract';
import { SendMessageBuilderOptions, SqsMessage } from '../types';

export const validateMessage = <Contract extends SQSContract>({
  contract,
  message,
  options,
  index,
}: {
  contract: Contract;
  message: SqsMessage<Contract>;
  options: SendMessageBuilderOptions<Contract>;
  index?: number;
}): void => {
  const { body, messageAttributes } = message;

  const bodyValidator = getBodyValidator<Contract>(contract, options);
  if (bodyValidator !== undefined && !bodyValidator(body)) {
    console.error(
      `Error: Invalid message body ${
        index !== undefined ? `at index ${index}` : ''
      }`,
      JSON.stringify(bodyValidator.errors, null, 2),
    );
    throw new Error('Error: Invalid message body');
  }

  if (messageAttributes === undefined) {
    return;
  }

  const messageAttributesValidator = getMessageAttributesValidator<Contract>(
    contract,
    options,
  );
  if (
    messageAttributesValidator !== undefined &&
    !messageAttributesValidator(messageAttributes)
  ) {
    console.error(
      `Error: Invalid message attributes ${
        index !== undefined ? `at index ${index}` : ''
      }`,
      JSON.stringify(messageAttributesValidator.errors, null, 2),
    );
    throw new Error('Error: Invalid message attributes');
  }
};

export const validateMessages = <Contract extends SQSContract>({
  contract,
  messages,
  options,
}: {
  contract: Contract;
  messages: SqsMessage<Contract>[];
  options: SendMessageBuilderOptions<Contract>;
}): void => {
  const errors = [];
  messages.forEach((message, index) => {
    try {
      validateMessage<Contract>({ contract, message, options, index });
    } catch (error) {
      errors.push(error);
    }
  });
  if (errors.length > 0) {
    throw new Error('Error: Invalid message');
  }
};
