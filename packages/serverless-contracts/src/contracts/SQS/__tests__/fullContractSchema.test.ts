import {
  messageAttributesSchema,
  messageBodySchema,
  minimalSqsContract,
  sqsContract,
} from './mock';
import { getFullContractSchema } from '../features';

describe('SQS contract fullContract tests', () => {
  it('should generate a proper full Contract with minimal config', () => {
    const fullContractSchema = getFullContractSchema(minimalSqsContract);
    expect(fullContractSchema).toEqual({
      type: 'object',
      properties: {
        id: { const: 'myAwesomeMinimalSQSContract' },
        contractType: { const: 'SQS' },
        messageBodySchema: { type: 'string' },
      },
      required: ['id', 'contractType', 'messageBodySchema'],
      additionalProperties: false,
    });
  });
  it('should generate a proper full Contract with full config', () => {
    const fullContractSchema = getFullContractSchema(sqsContract);
    expect(fullContractSchema).toEqual({
      type: 'object',
      properties: {
        id: { const: 'myAwesomeSQSContract' },
        contractType: { const: 'SQS' },
        messageBodySchema,
        messageAttributesSchema,
      },
      required: ['id', 'contractType', 'messageBodySchema'],
      additionalProperties: false,
    });
  });
});
