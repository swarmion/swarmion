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
 * a simple helper type to build EventBridgeHandler
 */
type SQSHandlerParameters = Parameters<AwsSQSHandler>;

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
 * The type of the basic Swarmion handler, with type-inferred event
 * The handler function can define additional arguments
 */
export type SwarmionSQSHandler<
  MessageBody,
  MessageAttributes,
  AdditionalArgs extends unknown[],
> = (
  event: { Records: SwarmionSQSRecord<MessageBody, MessageAttributes>[] },
  context: SQSHandlerParameters[1],
  callback?: SQSHandlerParameters[2],
  ...additionalArgs: AdditionalArgs
) => Promise<unknown>;
