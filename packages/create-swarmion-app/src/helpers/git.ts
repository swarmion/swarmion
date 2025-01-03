import { execSync } from 'child_process';
import path from 'path';
import { rimrafSync } from 'rimraf';

const isInGitRepository = (): boolean => {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });

    return true;
    // eslint-disable-next-line no-empty
  } catch {}

  return false;
};

const isInMercurialRepository = (): boolean => {
  try {
    execSync('hg --cwd . root', { stdio: 'ignore' });

    return true;
    // eslint-disable-next-line no-empty
  } catch {}

  return false;
};

export const tryGitInit = (root: string): boolean => {
  let didInit = false;
  try {
    execSync('git --version', { stdio: 'ignore' });
    if (isInGitRepository() || isInMercurialRepository()) {
      return false;
    }

    execSync('git init', { stdio: 'ignore' });
    didInit = true;

    execSync('git checkout -b main', { stdio: 'ignore' });

    execSync('git add -A', { stdio: 'ignore' });
    execSync('git commit -m "Initial commit from Create Swarmion App"', {
      stdio: 'ignore',
    });

    return true;
  } catch {
    if (didInit) {
      try {
        rimrafSync(path.join(root, '.git'));
        // eslint-disable-next-line no-empty
      } catch {}
    }

    return false;
  }
};
