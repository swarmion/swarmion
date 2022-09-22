import { EventBridgeContract } from '../eventBridgeContract';
import { FullContractSchemaType } from '../types/fullContract';

/**
 * Returns the aggregated EventBridgeContract schema in order to compare contracts versions.
 *
 * This also enables to infer the type with `json-schema-to-ts`.
 *
 *  @param contract your EventBridgeContract
 */
export const getFullContractSchema = <Contract extends EventBridgeContract>(
  contract: Contract,
): FullContractSchemaType<Contract> => {
  const properties = {
    id: { const: contract.id },
    contractType: { const: contract.contractType },
    source: { const: contract.source },
    eventType: { const: contract.eventType },
    payloadSchema: contract.payloadSchema,
  };

  return {
    type: 'object',
    properties,
    required: ['id', 'contractType', 'source', 'eventType', 'payloadSchema'],
    additionalProperties: false,
  };
};
