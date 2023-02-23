import {
  getWorkspaceLayout,
  readProjectConfiguration,
  Tree,
  writeJson,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import fs from 'fs';

import { Schema } from '../types';
import generator from './index';

vi.mock('../helpers/updatePackages.ts');

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

  it('should create a symlink to the common configuration launch.json when it exists', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    writeJson(appTree, 'commonConfiguration/.vscode/launch.json', {
      version: '0.2.0',
    });

    const generate = await generator(appTree, options);
    generate();

    expect(fs.existsSync).toHaveBeenCalledWith(
      '/virtual/commonConfiguration/.vscode/.git',
    );
  });

  it('should not create a symlink to the common configuration launch.json when it does not exist', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);

    const generate = await generator(appTree, options);
    generate();

    expect(fs.existsSync).not.toHaveBeenCalled();
  });
});
