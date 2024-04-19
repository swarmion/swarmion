import { SQSRecord } from 'aws-lambda';

import { parseMessageAttributes } from './parseMessageAttributes';
import { GetSQSHandlerOptions, SwarmionSQSRecord } from '../types';

export const parseRecord =
  <MessageBody, MessageAttributes>({
    bodyParser,
  }: GetSQSHandlerOptions<boolean>) =>
  (
    { body, messageAttributes, ...rest }: SQSRecord,
    index: number,
  ): SwarmionSQSRecord<MessageBody, MessageAttributes> => {
    try {
      return {
        ...rest,
        body:
          bodyParser !== undefined
            ? (bodyParser(body) as MessageBody) // Validation is done after
            : (body as MessageBody), // Validation is done after
        messageAttributes: parseMessageAttributes(
          messageAttributes,
        ) as MessageAttributes, // Validation is done after
      };
    } catch (e) {
      console.error(
        `Error while parsing SQS Record at index ${index}. Please use the \`logRawEvent\` option to debug`,
      );
      throw e;
    }
  };
