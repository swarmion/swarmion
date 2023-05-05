import { ProjectConfiguration } from '@nx/devkit';

export const packageProjectJson = (root: string): ProjectConfiguration => ({
  root,
  projectType: 'application',
  tags: [],
  implicitDependencies: [],
});
