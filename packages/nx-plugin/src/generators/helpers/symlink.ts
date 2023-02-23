import { existsSync, symlinkSync } from 'fs';
import { join } from 'path';

import { NormalizedSchema } from '../types';

export const symlinkVsCodeConfiguration = (options: NormalizedSchema): void => {
  const relativePath = join(
    options.offsetFromRoot,
    'commonConfiguration/.vscode',
  );

  if (!existsSync(relativePath)) {
    return;
  }

  symlinkSync(relativePath, join(options.packageRoot, '.vscode'), 'dir');
};
