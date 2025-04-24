import { MessageAttributeValue, SendMessageRequest } from '@aws-sdk/client-sqs';
import { JSONSchema } from 'json-schema-to-ts';

import { StringOrNumberDictionaryJSONSchema } from '../../../types/constrainedJSONSchema';
import { SQSContract } from '../sqsContract';

const serializeMessageAttribute = (
  attributeValue: unknown,
  attributeSchema: JSONSchema,
): MessageAttributeValue => {
  if (typeof attributeSchema === 'boolean') {
    throw new Error('Invalid contract messageAttributesSchema');
  }
  const { type } = attributeSchema;

  // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
  switch (type) {
    case 'string':
      return { StringValue: attributeValue as string, DataType: 'String' };
    case 'number':
      return {
        StringValue: (attributeValue as number).toString(),
        DataType: 'Number',
      };
    default:
      throw new Error(
        'Invalid messageAttributesSchema. Only string and number are currently supported',
      );
  }
};
export const serializeMessageAttributes = <
  MessageAttributes extends StringOrNumberDictionaryJSONSchema,
  Contract extends SQSContract,
>(
  messageAttributes: MessageAttributes,
  contract: Contract,
): SendMessageRequest['MessageAttributes'] => {
  const { properties } = contract.messageAttributesSchema;

  if (properties === undefined) {
    throw new Error('Invalid contract messageAttributesSchema');
  }

  return Object.entries(properties).reduce<
    SendMessageRequest['MessageAttributes']
  >(
    (acc, [attributeName, attributeSchema]) => {
      if (messageAttributes[attributeName] === undefined) {
        return acc;
      }

      return {
        ...acc,
        [attributeName]: serializeMessageAttribute(
          messageAttributes[attributeName],
          attributeSchema,
        ),
      };
    },
    {} as SendMessageRequest['MessageAttributes'],
  );
};
