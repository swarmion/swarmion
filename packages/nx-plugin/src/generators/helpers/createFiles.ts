import { generateFiles, names, Tree } from '@nrwl/devkit';

import { NormalizedSchema } from '../types';

export const createFiles = (
  tree: Tree,
  options: NormalizedSchema,
  sourcePath: string,
): void => {
  const { className, name, propertyName } = names(options.name);

  generateFiles(tree, sourcePath, options.packageRoot, {
    ...options,
    dot: '.',
    className,
    name,
    propertyName,
    cliCommand: 'nx',
    strict: undefined,
    tmpl: '',
  });
};
