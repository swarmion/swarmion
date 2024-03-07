import {
  SQSMessageAttribute,
  SQSMessageAttributeDataType,
  SQSRecord,
} from 'aws-lambda';

const parseDataType = (
  dataType: SQSMessageAttributeDataType,
): 'String' | 'Number' | 'Binary' =>
  dataType.split('.')[0] as 'String' | 'Number' | 'Binary';
const parseMessageAttribute = (attribute: SQSMessageAttribute): unknown => {
  const dataType = parseDataType(attribute.dataType);
  switch (dataType) {
    case 'Binary':
      return attribute.binaryValue;
    case 'String':
      return attribute.stringValue;
    case 'Number':
      return Number(attribute.stringValue);
  }
};
export const parseMessageAttributes = <
  MessageAttributes extends Record<string, unknown>,
>(
  messageAttributes: SQSRecord['messageAttributes'],
): MessageAttributes =>
  Object.entries(messageAttributes).reduce<MessageAttributes>(
    (acc, [attributeName, attribute]) => {
      return {
        ...acc,
        [attributeName]: parseMessageAttribute(attribute),
      };
    },
    {} as MessageAttributes,
  );
