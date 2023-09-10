import { SQSContract } from '../sqsContract';

/**
 * Computed schema type of the input validation schema.
 *
 * Can be used with `FromSchema` to infer the type of the contract of the lambda
 */
export interface FullContractSchemaType<Contract extends SQSContract> {
  type: 'object';
  properties: {
    id: { const: Contract['id'] };
    contractType: { const: Contract['contractType'] };
    messageBodySchema: Contract['messageBodySchema'];
    messageAttributesSchema?: NonNullable<Contract['messageAttributesSchema']>;
  };
  required: ['id', 'contractType', 'messageBodySchema'];
  additionalProperties: false;
  [key: string]: unknown;
}
