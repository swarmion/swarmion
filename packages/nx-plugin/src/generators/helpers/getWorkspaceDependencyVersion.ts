import { execSync } from 'child_process';

type PackageDescription = {
  name: string;
  version: string;
  dependencies?: Record<string, PackageDescription>;
};

export const getWorkspaceDependencyVersion = (
  dependencyName: string,
): string => {
  const packages = JSON.parse(
    execSync(`pnpm why -rP --json ${dependencyName}`).toString(),
  ) as PackageDescription[];

  return (
    packages
      .filter(({ dependencies }) => dependencies !== undefined)
      .map(({ dependencies = {} }) => dependencies[dependencyName])[0]
      ?.version ?? 'latest'
  );
};
