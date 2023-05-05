import { formatFiles, Tree } from '@nx/devkit';
import { join } from 'path';

import { normalizeOptions, packageGenerator, updatePackages } from '../helpers';
import { GeneratorType, Schema } from '../types';
import {
  packageJson,
  packageProjectJson,
  packageTsConfig,
} from './typed-json-config';

const SOURCE_FOLDER =
  process.env.NODE_ENV === 'test'
    ? '../../../schemas/cdk-service/files'
    : '../schemas/cdk-service/files';

export default async (tree: Tree, schema: Schema): Promise<() => void> => {
  const options = normalizeOptions(tree, schema, GeneratorType.SERVICE);

  packageGenerator({
    tree,
    options,
    sourcePath: join(__dirname, SOURCE_FOLDER),
    packageJson,
    packageProjectJson,
    packageTsConfig,
  });
  await formatFiles(tree);

  return () => {
    updatePackages(tree, options);
  };
};
