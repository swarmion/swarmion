import {
  addProjectConfiguration,
  ProjectConfiguration,
  Tree,
  writeJson,
} from '@nx/devkit';
import { join } from 'path';

import { NormalizedSchema, PackageJson, TsConfig } from '../types';
import { createFiles } from './createFiles';
import { updateCodeWorkspace } from './updateCodeWorkspace';
import { updatePnpmWorkspaces } from './updatePnpmWorkspaces';
import { updateRootTsConfig } from './updateRootTsConfig';

interface PackageGeneratorParams {
  tree: Tree;
  options: NormalizedSchema;
  sourcePath: string;
  packageJson: (options: NormalizedSchema) => PackageJson;
  packageProjectJson: (root: string) => ProjectConfiguration;
  packageTsConfig: (options: NormalizedSchema) => TsConfig;
}

export const packageGenerator = ({
  options,
  packageJson,
  packageProjectJson,
  packageTsConfig,
  sourcePath,
  tree,
}: PackageGeneratorParams): void => {
  createFiles(tree, options, sourcePath);

  writeJson(
    tree,
    join(options.packageRoot, `package.json`),
    packageJson(options),
  );

  writeJson(
    tree,
    join(options.packageRoot, `tsconfig.json`),
    packageTsConfig(options),
  );

  const projectConfiguration = packageProjectJson(options.packageRoot);
  addProjectConfiguration(tree, options.importPath, projectConfiguration);

  updateCodeWorkspace(tree, options);
  updatePnpmWorkspaces(tree, options);
  updateRootTsConfig(tree, options);
};
