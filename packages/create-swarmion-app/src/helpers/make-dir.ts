import fs from 'fs';

export const makeDir = (
  root: string,
  options = { recursive: true },
): Promise<string | undefined> => {
  return fs.promises.mkdir(root, options);
};
