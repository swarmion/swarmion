import { ProjectConfiguration } from '@nrwl/devkit';

export const packageProjectJson = (root: string): ProjectConfiguration => ({
  root,
  projectType: 'application',
  tags: [],
  implicitDependencies: ['backend-core'],
});
