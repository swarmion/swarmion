import { CloudFormationContract } from '../cloudFormationContract';
import { FullContractSchemaType } from '../types';

export const getFullContractSchema = <Contract extends CloudFormationContract>(
  contract: Contract,
): FullContractSchemaType<Contract['name']> => {
  return {
    type: 'object',
    properties: {
      contractId: { const: contract.id },
      contractType: { const: 'cloudFormation' },
      name: { const: contract.name },
    },
    required: ['contractId', 'name', 'contractType'],
    additionalProperties: false,
  };
};
