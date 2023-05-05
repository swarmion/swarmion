import { formatFiles, Tree, writeJson } from '@nx/devkit';
import { join } from 'path';

import { normalizeOptions, packageGenerator, updatePackages } from '../helpers';
import { GeneratorType, Schema } from '../types';
import {
  packageBuildTsConfig,
  packageJson,
  packageProjectJson,
  packageTsConfig,
} from './typed-json-config';

const SOURCE_FOLDER =
  process.env.NODE_ENV === 'test'
    ? '../../../schemas/library/files'
    : '../schemas/library/files';

export default async (tree: Tree, schema: Schema): Promise<() => void> => {
  const options = normalizeOptions(tree, schema, GeneratorType.LIBRARY);

  packageGenerator({
    tree,
    options,
    sourcePath: join(__dirname, SOURCE_FOLDER),
    packageJson,
    packageProjectJson,
    packageTsConfig,
  });
  writeJson(
    tree,
    join(options.packageRoot, `tsconfig.build.json`),
    packageBuildTsConfig(options),
  );
  await formatFiles(tree);

  return () => {
    updatePackages(tree, options);
  };
};
