import {
  getWorkspaceLayout,
  readProjectConfiguration,
  Tree,
  writeJson,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { Schema } from '../types';
import generator from './index';

describe('library generator', () => {
  let appTree: Tree;
  const options: Schema = { name: 'test', directory: 'packages' };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    writeJson(
      appTree,
      `${getWorkspaceLayout(appTree).npmScope}.code-workspace`,
      { folders: [] },
    );
    writeJson(appTree, 'tsconfig.json', { references: [] });
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
  });

  it('should add a reference to the root tsconfig.json', async () => {
    await generator(appTree, options);

    expect(
      JSON.parse(appTree.read('tsconfig.json', 'utf8') ?? ''),
    ).toStrictEqual({
      references: [
        {
          path: './packages/test/tsconfig.build.json',
        },
      ],
    });
  });
});
