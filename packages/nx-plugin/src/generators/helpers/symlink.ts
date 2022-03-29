import { symlinkSync } from 'fs';
import { join } from 'path';

import { NormalizedSchema } from '../types';

export const symlinkVsCodeConfiguration = (options: NormalizedSchema): void => {
  const relativePath = join(
    options.offsetFromRoot,
    'commonConfiguration/.vscode',
  );
  symlinkSync(relativePath, join(options.packageRoot, '.vscode'), 'dir');
};
