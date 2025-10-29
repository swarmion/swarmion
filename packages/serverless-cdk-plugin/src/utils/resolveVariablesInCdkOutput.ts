import traverse from 'neotraverse/legacy';

import { CloudFormationTemplate, ResolveVariable } from 'types';

const resolveVariablesInString = async (
  stringToResolve: string,
  resolveVariable: ResolveVariable,
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
  cdkOutput: CloudFormationTemplate,
  resolveVariable?: ResolveVariable,
): Promise<void> => {
  const toResolvePaths: PropertyKey[][] = [];

  const traversedOutput = traverse(cdkOutput);
  traversedOutput.forEach(function (node: unknown) {
    if (typeof node === 'string' && node.includes('${')) {
      // In this context, this.path is the path to the node being explored by traverse
      toResolvePaths.push(this.path);
    }
  });

  if (toResolvePaths.length === 0) {
    return;
  }

  if (resolveVariable === undefined) {
    console.warn('Serverless variables wont be resolved !');

    return;
  }

  await Promise.all(
    toResolvePaths.map(async path => {
      const newValue = await resolveVariablesInString(
        traversedOutput.get(path) as string,
        resolveVariable,
      );

      traversedOutput.set(path, newValue);
    }),
  );
};
