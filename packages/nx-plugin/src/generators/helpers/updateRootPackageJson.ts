import { Tree, updateJson } from '@nrwl/devkit';

import { NormalizedSchema } from '../types';

type PackageJsonType = {
  workspaces: string[];
  [key: string]: unknown;
};

export const updateRootPackageJson = (
  tree: Tree,
  options: NormalizedSchema,
): void => {
  updateJson(tree, 'package.json', (json: PackageJsonType) => {
    json.workspaces = Array.from(
      new Set(json.workspaces).add(`${options.directory}/*`),
    ).sort();

    return json;
  });
};
