import { got } from 'got';
import { Stream } from 'stream';
import { extract } from 'tar';
import { promisify } from 'util';

import getFilenameFromBranch from './getFilenameFromBranch';
const pipeline = promisify(Stream.pipeline);

export type RepoInfo = {
  username: string;
  name: string;
  branch: string;
  filePath: string;
};

const isUrlOk = async (url: string): Promise<boolean> => {
  try {
    const res = await got.head(url);

    return res.statusCode === 200;
  } catch {
    return false;
  }
};

export const hasRepo = ({
  username,
  name,
  branch,
  filePath,
}: RepoInfo): Promise<boolean> => {
  const contentsUrl = `https://api.github.com/repos/${username}/${name}/contents`;
  const packagePath = `${filePath !== '' ? `/${filePath}` : ''}/package.json`;

  return isUrlOk(contentsUrl + packagePath + `?ref=${branch}`);
};

export const getRepoUrl = ({
  username,
  name,
  branch,
  filePath,
}: RepoInfo): string => {
  return `https://github.com/${username}/${name}/tree/${branch}/${filePath}`;
};

export const downloadAndExtractRepo = (
  root: string,
  { username, name, branch, filePath }: RepoInfo,
): Promise<void> => {
  return pipeline(
    got.stream(
      `https://codeload.github.com/${username}/${name}/tar.gz/${branch}`,
    ),
    extract(
      {
        cwd: root,
        strip: filePath !== '' ? filePath.split('/').length + 1 : 1,
      },
      [
        `${name}-${getFilenameFromBranch(branch)}${
          filePath !== '' ? `/${filePath}` : ''
        }`,
      ],
    ),
  );
};
