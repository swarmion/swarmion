import { GenericContract } from 'types/genericContract';

import {
  CloudFormationExport,
  CloudFormationImport,
  FullContractSchemaType,
} from './types';

/**
 * CloudFormationContract:
 *
 * a contract used to define a type-safe import/export through CloudFormation.
 *
 * Main features:
 * - export and import generated and type-safe;
 * - generation of a contract document that can be checked for breaking changes;
 */
export class CloudFormationContract<Name extends string>
  implements GenericContract
{
  private _id: string;
  private _name: Name;
  public contractId: string;
  public fullContractSchema: FullContractSchemaType<Name>;

  /**
   * Builds a new ApiGateway contract
   *
   * @param id a unique id to identify the contract among stacks. Beware uniqueness!
   * @param name the name of the export
   * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-importvalue.html
   */
  constructor({ id, name }: { id: string; name: Name }) {
    this._id = id;
    this._name = name;

    this.contractId = id;
    this.fullContractSchema = this.getFullContractSchema();
  }

  /**
   * @returns the CloudFormation { Fn::ImportValue } function corresponding to the name
   */
  get importValue(): CloudFormationImport<Name> {
    return { 'Fn::ImportValue': this._name };
  }

  /**
   * @returns the CloudFormation import name to use with Fn.importValue in CDK
   */
  get cdkImportValue(): Name {
    return this._name;
  }

  /**
   * @param description the description used in CloudFormation for this value
   * @param value the CloudFormation function passed to the export
   * For more information, see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-importvalue.html
   * @returns the CloudFormation Export function
   */
  exportValue<Value>({
    description,
    value,
  }: {
    description: string;
    value: Value;
  }): CloudFormationExport<Name, Value> {
    return {
      Description: description,
      Value: value,
      Export: { Name: this._name },
    };
  }

  private getFullContractSchema(): FullContractSchemaType<Name> {
    return {
      type: 'object',
      properties: {
        contractId: { const: this._id },
        contractType: { const: 'cloudFormation' },
        name: { const: this._name },
      },
      required: ['contractId', 'name', 'contractType'],
      additionalProperties: false,
    };
  }
}
