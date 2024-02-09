import { SQSRecord } from 'aws-lambda';

import { parseMessageAttributes } from './parseMessageAttributes';
import { GetSQSHandlerOptions, SwarmionSQSRecord } from '../types';

export const parseRecord =
  <MessageBody, MessageAttributes>({ bodyParser }: GetSQSHandlerOptions) =>
  ({
    body,
    messageAttributes,
    ...rest
  }: SQSRecord): SwarmionSQSRecord<MessageBody, MessageAttributes> => ({
    ...rest,
    body:
      bodyParser !== undefined
        ? (bodyParser(body) as MessageBody) // Validation is done after
        : (body as MessageBody), // Validation is done after
    messageAttributes: parseMessageAttributes(
      messageAttributes,
    ) as MessageAttributes, // Validation is done after
  });
