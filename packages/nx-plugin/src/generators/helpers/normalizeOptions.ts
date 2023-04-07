import {
  getWorkspaceLayout,
  joinPathFragments,
  names,
  Tree,
} from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
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

  const { npmScope } = getWorkspaceLayout(tree);
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
    workspaceName: npmScope,
  };
};
