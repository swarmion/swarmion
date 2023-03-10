import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

import { testEnvVarsParameterPath } from './consts';
import { syncTestEnvVarType } from './syncTestEnvVarType';

type Props = {
  value: string;
};

const getStringContext = (
  scope: Construct,
  contextName: string,
): string | undefined => {
  const context = scope.node.tryGetContext(contextName) as
    | string
    | undefined
    | unknown;
  if (context !== undefined && typeof context !== 'string') {
    throw new Error(
      `${contextName} context variable must be a string if defined`,
    );
  }

  return context;
};

export const SCOPE_CONTEXT_NAME = 'testEnvVarScope';
export const TYPE_PATH_CONTEXT_NAME = 'testEnvVarTypePath';

export class TestEnvVar extends Construct {
  constructor(scope: Construct, id: string, { value }: Props) {
    super(scope, id);
    const testEnvVarScope = getStringContext(this, SCOPE_CONTEXT_NAME);
    const testEnvVarTypePath = getStringContext(this, TYPE_PATH_CONTEXT_NAME);
    if (testEnvVarTypePath !== undefined) {
      syncTestEnvVarType({ name: id, filePath: testEnvVarTypePath });
    }
    new StringParameter(scope, `${id}_TestEnvVarParameter`, {
      stringValue: value,
      parameterName: [
        '', // parameter path must start with a slash
        testEnvVarsParameterPath,
        ...(testEnvVarScope !== undefined ? [testEnvVarScope] : []),
        id,
      ].join('/'),
    });
  }
}
