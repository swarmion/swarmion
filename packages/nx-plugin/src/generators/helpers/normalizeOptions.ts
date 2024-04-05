import { joinPathFragments, names, readJson, Tree } from '@nx/devkit';
import { Linter } from '@nx/linter';
import { createHash } from 'crypto';
import { relative } from 'path';

import { GeneratorType, NormalizedSchema, Schema } from '../types';

export const normalizeOptions = (
  tree: Tree,
  options: Schema,
  generatorType: GeneratorType,
): NormalizedSchema => {
  const projectName = names(options.name).fileName.replace(
    new RegExp('/', 'g'),
    '-',
  );
  const packageRoot = joinPathFragments(
    names(options.directory).fileName,
    projectName,
  );

  const linter = Linter.EsLint;

  const { className, propertyName } = names(projectName);

  const workspaceName = getWorkspaceNameFromPackageJson(tree);
  const offsetFromRoot = relative(packageRoot, tree.root);

  // hashed project name is a 10 char string
  const hashedProjectName = createHash('sha512')
    .update(projectName)
    .digest('hex') // use hex to get a hash without special chars [a-z0-9]. Special chars break some CDK features
    .slice(0, 10);

  return {
    ...options,
    projectClassName: className,
    projectPropertyName: propertyName,
    hashedProjectName,
    generatorType,
    importPath: projectName,
    linter,
    name: projectName,
    packageRoot,
    offsetFromRoot,
    workspaceName,
  };
};

/**
 * parse the root package.json to retrieve the workspaceName
 */
export const getWorkspaceNameFromPackageJson = (tree: Tree): string => {
  const { name } = tree.exists('package.json')
    ? readJson<{ name?: string }>(tree, 'package.json')
    : { name: null };

  // it is actually shorter here to write a single condition
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (name != null && name.startsWith('@')) {
    const workspaceName = name.split('/')[0]?.substring(1);

    if (workspaceName === undefined) {
      throw new Error('expected workspace name in root package.json');
    }

    return workspaceName;
  } else {
    throw new Error('expected workspace name in root package.json');
  }
};
