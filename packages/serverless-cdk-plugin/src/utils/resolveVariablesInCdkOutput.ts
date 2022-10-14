import traverse from 'traverse';

import { CloudFormationTemplate, ResolveVariable } from 'types';

const resolveVariablesInString = async (
  resolveVariable: ResolveVariable,
  stringToResolve: string,
) => {
  try {
    const resolvedString = await resolveVariable(stringToResolve);

    // If variable was resolved in the string, the return value is ${myResolvedValue}
    if (!resolvedString.match(/\$\{.*\}/)) {
      throw new Error('Unexpected returned value from sls variable resolver');
    }

    return resolvedString.slice('${'.length, -'}'.length);
  } catch {
    // The resolving failed, we silently return the original string
    return stringToResolve;
  }
};

export const resolveVariablesInCdkOutput = async (
  resolveVariable: ResolveVariable,
  cdkOutput: CloudFormationTemplate,
): Promise<void> => {
  const toResolvePaths: string[][] = [];

  const traversedOutput = traverse(cdkOutput);
  traversedOutput.forEach(function (node: unknown) {
    if (typeof node === 'string' && node.includes('${')) {
      // In this context, this.path is the path to the node being explored by traverse
      toResolvePaths.push(this.path);
    }
  });

  await Promise.all(
    toResolvePaths.map(async path => {
      const newValue = await resolveVariablesInString(
        resolveVariable,
        traversedOutput.get(path) as string,
      );

      traversedOutput.set(path, newValue);
    }),
  );
};
