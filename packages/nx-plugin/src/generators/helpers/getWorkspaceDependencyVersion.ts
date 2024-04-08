import { execSync } from 'child_process';

type PackageDescription = {
  name: string;
  version: string;
  dependencies?: Record<string, PackageDescription>;
  devDependencies?: Record<string, PackageDescription>;
};

export const getWorkspaceDependencyVersion = (
  dependencyName: string,
): string => {
  const packages = JSON.parse(
    execSync(`pnpm why -r --json --depth 1 ${dependencyName}`).toString(),
  ) as PackageDescription[];

  const resolvedPackage = packages.find(
    ({ dependencies, devDependencies }) =>
      dependencies !== undefined || devDependencies !== undefined,
  );

  const version =
    resolvedPackage?.dependencies?.[dependencyName]?.version ??
    resolvedPackage?.devDependencies?.[dependencyName]?.version ??
    'latest';

  return version;
};
