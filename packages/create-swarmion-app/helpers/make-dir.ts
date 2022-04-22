import fs from 'fs';

export const makeDir = (
  root: string,
  options = { recursive: true },
): Promise<void> => {
  return fs.promises.mkdir(root, options);
};
