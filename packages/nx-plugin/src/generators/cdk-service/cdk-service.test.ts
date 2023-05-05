import {
  getWorkspaceLayout,
  readProjectConfiguration,
  Tree,
  writeJson,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { stringify } from 'yaml';

import { Schema } from '../types';
import generator from './index';

describe('cdk-service generator', () => {
  let appTree: Tree;
  const options: Schema = { name: 'test-cdk-service', directory: 'services' };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    writeJson(
      appTree,
      `${getWorkspaceLayout(appTree).npmScope}.code-workspace`,
      { folders: [] },
    );
    writeJson(appTree, 'tsconfig.json', { references: [] });
    appTree.write('pnpm-workspace.yaml', stringify({ packages: [] }));
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test-cdk-service');
    expect(config).toBeDefined();
  });

  it('should add a reference to the root tsconfig.json', async () => {
    await generator(appTree, options);

    expect(
      JSON.parse(appTree.read('tsconfig.json', 'utf8') ?? ''),
    ).toStrictEqual({
      references: [
        {
          path: './services/test-cdk-service/tsconfig.json',
        },
      ],
    });
  });
});
