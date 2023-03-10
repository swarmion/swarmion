import type { Parameter } from '@aws-sdk/client-ssm';
import { GetParametersByPathCommand, SSMClient } from '@aws-sdk/client-ssm';

import { testEnvVarsParameterPath } from './consts';

const client = new SSMClient({});

// TODO test it with integration test
export const getTestEnvVarParameters = async (
  lastCommandNextToken?: string,
): Promise<Parameter[]> => {
  const command = new GetParametersByPathCommand({
    Path: `/${testEnvVarsParameterPath}`,
    Recursive: true,
    WithDecryption: true,
    NextToken: lastCommandNextToken,
  });
  const { Parameters, NextToken } = await client.send(command);
  if (NextToken !== undefined) {
    return [
      ...(Parameters ?? []),
      ...(await getTestEnvVarParameters(NextToken)),
    ];
  }

  return Parameters ?? [];
};
