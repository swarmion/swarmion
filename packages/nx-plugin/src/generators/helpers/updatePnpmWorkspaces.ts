import { Tree } from '@nx/devkit';
import { parse, stringify } from 'yaml';

import { NormalizedSchema } from '../types';

interface PnpmWorkspacesType {
  packages: string[];
}

export const updatePnpmWorkspaces = (
  tree: Tree,
  options: NormalizedSchema,
): void => {
  const pnpmWorkspacesFilePath = 'pnpm-workspace.yaml';

  const pnpmWorkspacesFile = tree.read(pnpmWorkspacesFilePath) ?? '';

  const pnpmWorkspaces = parse(
    pnpmWorkspacesFile.toString(),
  ) as PnpmWorkspacesType;

  const newPackages = Array.from(
    new Set(pnpmWorkspaces.packages).add(`${options.directory}/*`),
  ).sort((a, b) => a.localeCompare(b));

  tree.write(
    pnpmWorkspacesFilePath,
    stringify({ packages: newPackages }, { defaultStringType: 'QUOTE_SINGLE' }),
  );
};
