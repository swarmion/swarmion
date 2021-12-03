/**
 * The CloudFormation importValue type.
 *
 * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-importvalue.html
 */
export type CloudFormationImport<Name extends string> = {
  'Fn::ImportValue': Name;
};

/**
 * The CloudFormation export type.
 *
 * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-importvalue.html
 */
export type CloudFormationExport<Name extends string, Value> = {
  Description: string;
  Value: Value;
  Export: { Name: Name };
};

export interface FullContractSchemaType<Name extends string> {
  type: 'object';
  properties: {
    contractId: { const: string };
    contractType: { const: 'cloudFormation' };
    name: { const: Name };
  };
  required: ['contractId', 'name', 'contractType'];
  additionalProperties: false;
}
