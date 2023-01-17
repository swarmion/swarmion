import { Tree, updateJson } from '@nrwl/devkit';

import { NormalizedSchema } from '../types';

type CodeWorkspaceType = {
  folders: {
    path: string;
    name: string;
  }[];
};

const formatFolderName = (options: NormalizedSchema) => {
  const formattedName = options.name.replace(new RegExp('-', 'g'), ' ');

  return `${formattedName} [${options.generatorType.toLowerCase()}]`;
};

export const updateCodeWorkspace = (
  tree: Tree,
  options: NormalizedSchema,
): void => {
  updateJson(
    tree,
    `${options.workspaceName}.code-workspace`,
    (json: CodeWorkspaceType) => {
      json.folders.push({
        path: options.packageRoot,
        name: formatFolderName(options),
      });

      return json;
    },
  );
};
