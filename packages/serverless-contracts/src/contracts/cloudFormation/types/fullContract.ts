export interface FullContractSchemaType<Name extends string> {
  type: 'object';
  properties: {
    contractId: { const: string };
    contractType: { const: 'cloudFormation' };
    name: { const: Name };
  };
  required: ['contractId', 'name', 'contractType'];
  additionalProperties: false;
  [key: string]: unknown;
}
