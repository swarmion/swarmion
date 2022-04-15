import { formatFiles, Tree, writeJson } from '@nrwl/devkit';
import { join } from 'path';

import {
  normalizeOptions,
  packageGenerator,
  symlinkVsCodeConfiguration,
  updatePackages,
} from '../helpers';
import { GeneratorType, Schema } from '../types';
import {
  packageBuildTsConfig,
  packageJson,
  packageProjectJson,
  packageTsConfig,
} from './typed-json-config';

const SOURCE_FOLDER = './files';

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
    packageBuildTsConfig,
  );
  await formatFiles(tree);

  return () => {
    symlinkVsCodeConfiguration(options);
    updatePackages(tree, options);
  };
};
