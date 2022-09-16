import {
  getWorkspaceLayout,
  joinPathFragments,
  names,
  Tree,
} from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import { relative } from 'path';

import {
  GeneratorType,
  GeneratorTypeToDirectory,
  NormalizedSchema,
  Schema,
} from '../types';

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
  const { npmScope } = getWorkspaceLayout(tree);
  const offsetFromRoot = relative(packageRoot, tree.root);
  const importPath = formatImportPath(generatorType, projectName);

  return {
    ...options,
    fileName,
    generatorType,
    importPath,
    linter,
    name: projectName,
    packageRoot,
    offsetFromRoot,
    workspaceName: npmScope,
  };
};

const getCaseAwareFileName = (options: {
  pascalCaseFiles: boolean;
  fileName: string;
}) => {
  const normalized = names(options.fileName);

  return options.pascalCaseFiles ? normalized.className : normalized.fileName;
};

const formatImportPath = (
  generatorType: GeneratorType,
  projectName: string,
) => {
  switch (generatorType) {
    case GeneratorType.LIBRARY:
      return projectName;
    case GeneratorType.SERVICE:
      return `${GeneratorTypeToDirectory[generatorType]}-${projectName}`;
  }
};
