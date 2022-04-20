import { readJson, Tree } from '@nrwl/devkit';
import { execSync } from 'child_process';
import { join } from 'path';

import { NormalizedSchema } from '../types';

export const updatePackages = (tree: Tree, options: NormalizedSchema): void => {
  const { dependencies, devDependencies } = readJson<{
    dependencies?: { [key: string]: string };
    devDependencies?: { [key: string]: string };
    [key: string]: unknown;
  }>(tree, join(options.packageRoot, `package.json`));

  execSync(
    `yarn workspace \
      @${options.workspaceName}/${options.importPath} \
      add --cached ${Object.keys(dependencies ?? {}).join(' ')}`,
    {
      cwd: join(tree.root),
      stdio: [0, 1, 2],
    },
  );
  execSync(
    `yarn workspace \
      @${options.workspaceName}/${options.importPath} \
      add --cached -D ${Object.keys(devDependencies ?? {}).join(' ')}`,
    {
      cwd: join(tree.root),
      stdio: [0, 1, 2],
    },
  );
};
