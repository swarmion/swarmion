import { SQSContract } from '../sqsContract';
import { FullContractSchemaType } from '../types/fullContract';

/**
 * Returns the aggregated SQSContract schema in order to compare contracts versions.
 *
 * This also enables to infer the type with `json-schema-to-ts`.
 *
 *  @param contract your EventBridgeContract
 */
export const getFullContractSchema = <Contract extends SQSContract>(
  contract: Contract,
): FullContractSchemaType<Contract> => ({
  type: 'object',
  properties: {
    id: { const: contract.id },
    contractType: { const: contract.contractType },
    messageBodySchema: contract.messageBodySchema,
    ...(Object.keys(contract.messageAttributesSchema).length > 0
      ? { messageAttributesSchema: contract.messageAttributesSchema }
      : {}),
  },
  required: ['id', 'contractType', 'messageBodySchema'],
  additionalProperties: false,
});
