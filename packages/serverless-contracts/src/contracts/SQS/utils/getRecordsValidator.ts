import { ValidateFunction } from 'ajv';
import { JSONSchema } from 'json-schema-to-ts';

import { SQSContract } from '../sqsContract';
import { GetSQSHandlerOptions, SendMessageBuilderOptions } from '../types';

export const getSchema = <Contract extends SQSContract>(
  contract: Contract,
  { validateBody, validateAttributes }: GetSQSHandlerOptions<boolean>,
): JSONSchema | undefined => ({
  type: 'array',
  items: {
    type: 'object',
    properties: {
      ...(validateBody === true && { body: contract.messageBodySchema }),
      ...(validateAttributes === true && {
        messageAttributes: contract.messageAttributesSchema,
      }),
    },
    required: [
      ...(validateBody !== undefined ? ['body'] : []),
      ...(validateAttributes !== undefined ? ['messageAttributes'] : []),
    ],
    additionalProperties: true,
  },
});

const getRecordsValidationSchema = <Contract extends SQSContract>(
  contract: Contract,
  options: GetSQSHandlerOptions<boolean>,
): JSONSchema | undefined => {
  const { validateBody, validateAttributes } = options;
  if (
    (validateBody === undefined || !validateBody) &&
    (validateAttributes === undefined || !validateAttributes)
  ) {
    return undefined;
  }

  return getSchema(contract, options);
};

export const getRecordsValidator = <Contract extends SQSContract>(
  contract: Contract,
  options: GetSQSHandlerOptions<boolean>,
): ValidateFunction | undefined => {
  const recordsValidationSchema = getRecordsValidationSchema(contract, options);

  return recordsValidationSchema !== undefined
    ? options.ajv?.compile(recordsValidationSchema)
    : undefined;
};

export const getBodyValidator = <Contract extends SQSContract>(
  contract: Contract,
  options: SendMessageBuilderOptions<Contract>,
): ValidateFunction | undefined => {
  if (options.validateMessage === false) {
    return;
  }

  return options.ajv.compile(contract.messageBodySchema);
};

export const getMessageAttributesValidator = <Contract extends SQSContract>(
  contract: Contract,
  options: SendMessageBuilderOptions<Contract>,
): ValidateFunction | undefined => {
  if (
    options.validateMessage === false ||
    Object.keys(contract.messageAttributesSchema).length === 0
  ) {
    return;
  }

  return options.ajv.compile(contract.messageAttributesSchema);
};
