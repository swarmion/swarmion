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
  private _name: Name;

  /**
   * Builds a new ApiGateway contract
   *
   * @param name the name of the export
   * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-importvalue.html
   */
  constructor({ name }: { name: Name }) {
    this._name = name;
  }

  /**
   * @returns the CloudFormation { Fn::ImportValue } function corresponding to the name
   */
  get importValue(): CloudFormationImport<Name> {
    return { 'Fn::ImportValue': this._name };
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

  get fullContractSchema(): FullContractSchemaType<Name> {
    return {
      type: 'object',
      properties: {
        contractType: { const: 'cloudFormation' },
        name: { const: this._name },
      },
      required: ['name', 'contractType'],
      additionalProperties: false,
    };
  }
}
