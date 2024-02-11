import Ajv from 'ajv';
import { SQSHandler as AwsSQSHandler, SQSRecord } from 'aws-lambda';

/**
 * getHandler options for SQSContract
 */
export type GetSQSHandlerOptions =
  | {
      bodyParser?: ((body: string) => unknown) | undefined; // Default is JSON.parse. Pass explicit undefined bodyParser to avoid bodyParsing
      ajv: Ajv;
      validateBody?: boolean;
      validateAttributes?: boolean;
    }
  | {
      bodyParser?: ((body: string) => unknown) | undefined; // Default is JSON.parse. Pass explicit undefined bodyParser to avoid bodyParsing
      ajv?: Ajv;
      validateBody: false;
      validateAttributes: false;
    };

export type DefaultGetSQSHandlerOptions = {
  bodyParser: (body: string) => unknown;
  validateBody: true;
  validateAttributes: boolean;
  ajv?: undefined;
};

/**
 * a simple helper type to build SQSHandler
 */
export type SQSHandlerParameters = Parameters<AwsSQSHandler>;

/**
 * The type of an SQS handler. This is the actual version that will
 * be executed by the lambda, not the Swarmion inferred one.
 *
 * See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html.
 */
export type SQSHandler<AdditionalArgs extends unknown[]> = (
  event: SQSHandlerParameters[0],
  context: SQSHandlerParameters[1],
  callback: SQSHandlerParameters[2],
  ...additionalArgs: AdditionalArgs
) => Promise<unknown>;

export type SwarmionSQSRecord<MessageBody, MessageAttributes> = Omit<
  SQSRecord,
  'body' | 'messageAttributes'
> & {
  body: MessageBody;
  messageAttributes: MessageAttributes;
};

/**
 * The type of the basic Swarmion handler for SQS,
 * It receives all the records parsed and with their inferred type.
 * It must process all the records and handle errors if necessary.
 * Use SwarmionSQSHandler to avoid handling the whole batch, and to automatically process errors.
 * The handler function can define additional arguments
 */
export type SwarmionLambdaSQSHandler<
  MessageBody,
  MessageAttributes,
  AdditionalArgs extends unknown[],
> = (
  event: { records: SwarmionSQSRecord<MessageBody, MessageAttributes>[] },
  context: SQSHandlerParameters[1],
  callback?: SQSHandlerParameters[2],
  ...additionalArgs: AdditionalArgs
) => Promise<unknown>;

/**
 * The type of the Swarmion handler for SQS.
 * It receives only one record of the batch.
 * The record is parsed and with its inferred type.
 * It can throw an error if the record is invalid. The wrapper will catch it
 * and inform the SQS that the record couldn't be processed following the batch failure reporting spec.
 * https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html#services-sqs-batchfailurereporting
 * The handler function can define additional arguments
 */
export type SwarmionSQSHandler<
  MessageBody,
  MessageAttributes,
  AdditionalArgs extends unknown[],
> = (
  event: SwarmionSQSRecord<MessageBody, MessageAttributes>,
  context: SQSHandlerParameters[1],
  callback?: SQSHandlerParameters[2],
  ...additionalArgs: AdditionalArgs
) => Promise<unknown>;
