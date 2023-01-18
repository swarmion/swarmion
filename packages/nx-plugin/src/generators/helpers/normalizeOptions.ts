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
  const name = names(options.name).fileName;
  const packageRoot = joinPathFragments(
    names(options.directory).fileName,
    name,
  );

  const linter = Linter.EsLint;

  const projectName = name.replace(new RegExp('/', 'g'), '-');
  const fileName = getCaseAwareFileName({
    fileName: projectName,
    pascalCaseFiles: false,
  });
  const pascalName = getCaseAwareFileName({ fileName, pascalCaseFiles: true });

  const { npmScope } = getWorkspaceLayout(tree);
  const offsetFromRoot = relative(packageRoot, tree.root);

  return {
    ...options,
    fileName,
    pascalName,
    generatorType,
    importPath: projectName,
    linter,
    name: projectName,
    packageRoot,
    offsetFromRoot,
    workspaceName: npmScope,
    capitalize: capitalizeFirstLetter,
  };
};

const getCaseAwareFileName = (options: {
  pascalCaseFiles: boolean;
  fileName: string;
}) => {
  const normalized = names(options.fileName);

  return options.pascalCaseFiles ? normalized.className : normalized.fileName;
};

const capitalizeFirstLetter = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);
