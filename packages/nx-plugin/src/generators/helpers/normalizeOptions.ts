import {
  getWorkspaceLayout,
  joinPathFragments,
  names,
  Tree,
} from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
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

  return {
    ...options,
    projectClassName: className,
    projectPropertyName: propertyName,
    generatorType,
    importPath: projectName,
    linter,
    name: projectName,
    packageRoot,
    offsetFromRoot,
    workspaceName: npmScope,
  };
};
