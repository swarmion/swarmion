import { SQSContract } from '../sqsContract';
import {
  DefaultGetSQSHandlerOptions,
  GetSQSHandlerOptions,
  SQSHandler,
  SqsMessageAttributesType,
  SqsMessageBodyType,
  SwarmionLambdaSQSHandler,
  SwarmionSQSHandler,
} from '../types';
import {
  getAllRecordsHandler,
  getRecordsValidator,
  parseRecord,
} from '../utils';

const defaultOptions: DefaultGetSQSHandlerOptions = {
  bodyParser: (body: string) => JSON.parse(body) as unknown,
  validateBody: true,
  validateAttributes: true,
};

const getGetSQSHandler =
  <HandleRecords extends boolean = false>(handleRecords: HandleRecords) =>
  <
    Contract extends SQSContract,
    MessageBody = SqsMessageBodyType<Contract>,
    MessageAttributes = SqsMessageAttributesType<Contract>,
  >(
    contract: Contract,
    options: GetSQSHandlerOptions,
  ) =>
  <AdditionalArgs extends unknown[] = []>(
    handler: HandleRecords extends false
      ? SwarmionLambdaSQSHandler<MessageBody, MessageAttributes, AdditionalArgs>
      : SwarmionSQSHandler<MessageBody, MessageAttributes, AdditionalArgs>,
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

      if (handleRecords === false) {
        return (
          handler as SwarmionLambdaSQSHandler<
            MessageBody,
            MessageAttributes,
            AdditionalArgs
          >
        )({ records: parsedRecords }, context, callback, ...additionalArgs);
      }

      const allRecordsHandler = getAllRecordsHandler(
        // handleRecords is true, handler is SwarmionSQSHandler. Typescript is not able to infer this
        handler as SwarmionSQSHandler<
          MessageBody,
          MessageAttributes,
          AdditionalArgs
        >,
        context,
        callback,
        additionalArgs,
      );

      return allRecordsHandler({ records: parsedRecords });
    };
  };

/**
 * Returns the basic Swarmion handler for SQS,
 * The wrapper parses the body of the SQS messages
 * and calls the handler with all the records parsed and typed.
 * It must process all the records and handle errors if necessary.
 * Use getSQSHandler to avoid handling the whole batch, and to automatically process errors.
 * The handler function can define additional arguments
 */
export const getLambdaSQSHandler = getGetSQSHandler(false);

/**
 * Returns the Swarmion handler for SQS.
 * The wrapper parses the body of the SQS messages and report to SQS the batch failure.
 * It calls the handle with only one record of the batch.
 * The record is parsed and typed.
 * It can throw an error if the record is invalid.
 * The wrapper will catch it and inform the SQS that the record couldn't be processed
 * following the batch failure reporting spec.
 * https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html#services-sqs-batchfailurereporting
 * The handler function can define additional arguments
 */
export const getSQSHandler = getGetSQSHandler(true);
