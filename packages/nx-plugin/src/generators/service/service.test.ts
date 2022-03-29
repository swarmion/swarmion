import {
  getWorkspaceLayout,
  readProjectConfiguration,
  Tree,
  writeJson,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { Schema } from '../types';
import generator from './index';

describe('packages-generator generator', () => {
  let appTree: Tree;
  const options: Schema = { name: 'test', directory: 'backend' };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    writeJson(
      appTree,
      `${getWorkspaceLayout(appTree).npmScope}.code-workspace`,
      { folders: [] },
    );
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'backend-test');
    expect(config).toBeDefined();
  });
});
