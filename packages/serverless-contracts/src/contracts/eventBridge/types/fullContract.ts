import { EventBridgeContract } from '../eventBridgeContract';

/**
 * Computed schema type of the input validation schema.
 *
 * Can be used with `FromSchema` to infer the type of the contract of the lambda
 */
export interface FullContractSchemaType<Contract extends EventBridgeContract> {
  type: 'object';
  properties: {
    id: { const: Contract['id'] };
    contractType: { const: Contract['contractType'] };
    sources: { enum: Contract['sources'] };
    eventType: { const: Contract['eventType'] };
    payloadSchema: Contract['payloadSchema'];
  };
  required: ['id', 'contractType', 'sources', 'eventType', 'payloadSchema'];
  additionalProperties: false;
  [key: string]: unknown;
}
