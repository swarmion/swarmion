import { Tree, updateJson } from '@nrwl/devkit';

import { GeneratorType, NormalizedSchema, TsConfig } from '../types';

const getTsConfigPath = (options: NormalizedSchema) => {
  switch (options.generatorType) {
    case GeneratorType.LIBRARY:
      return `./${options.packageRoot}/tsconfig.build.json`;
    case GeneratorType.SERVICE:
    case GeneratorType.CDK_SERVICE:
      return `./${options.packageRoot}/tsconfig.json`;
  }
};

export const updateRootTsConfig = (
  tree: Tree,
  options: NormalizedSchema,
): void => {
  updateJson(tree, 'tsconfig.json', (json: TsConfig) => {
    json.references?.push({ path: getTsConfigPath(options) });

    return json;
  });
};
