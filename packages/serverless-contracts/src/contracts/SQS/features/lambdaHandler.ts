import { SQSContract } from '../sqsContract';
import {
  DefaultGetSQSHandlerOptions,
  GetSQSHandlerOptions,
  SQSHandler,
  SqsMessageAttributesType,
  SqsMessageBodyType,
  SwarmionSQSHandler,
} from '../types';
import { getRecordsValidator, parseRecord } from '../utils';

const defaultOptions: DefaultGetSQSHandlerOptions = {
  bodyParser: (body: string) => JSON.parse(body) as unknown,
  validateBody: true,
  validateAttributes: true,
};

export const getSQSHandler =
  <
    Contract extends SQSContract,
    MessageBody = SqsMessageBodyType<Contract>,
    MessageAttributes = SqsMessageAttributesType<Contract>,
  >(
    contract: Contract,
    options: GetSQSHandlerOptions,
  ) =>
  <AdditionalArgs extends unknown[] = []>(
    handler: SwarmionSQSHandler<MessageBody, MessageAttributes, AdditionalArgs>,
  ): SQSHandler<AdditionalArgs> => {
    const internalOptions = {
      ...defaultOptions,
      ...options,
    };

    const recordsValidator = getRecordsValidator(contract, internalOptions);

    return async (
      event,
      context,
      callback,
      ...additionalArgs: AdditionalArgs
    ) => {
      const { Records } = event;

      const parsedRecords = Records.map(
        parseRecord<MessageBody, MessageAttributes>(internalOptions),
      );
      if (recordsValidator !== undefined) {
        if (!recordsValidator(parsedRecords)) {
          console.error('Error: Invalid records');
          console.error(JSON.stringify(recordsValidator.errors, null, 2));
          throw new Error('Invalid records');
        }
      }

      return handler(
        { Records: parsedRecords },
        context,
        callback,
        ...additionalArgs,
      );
    };
  };
