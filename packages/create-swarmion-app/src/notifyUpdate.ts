import chalk from 'chalk';
import checkForUpdate from 'update-check';

import { getPkgManager } from 'helpers';

import packageJson from '../package.json';

const update = checkForUpdate(packageJson).catch(() => null);

const notifyUpdate = async (): Promise<void> => {
  try {
    const res = await update;
    if (res?.latest === undefined) {
      const pkgManager = getPkgManager();

      console.log(`
  
          ${chalk.yellow.bold(
            'A new version of `create-swarmion-app` is available!',
          )}
          You can update by running: ${chalk.cyan(
            pkgManager === 'yarn'
              ? 'yarn global add create-swarmion-app'
              : `${pkgManager} install --global create-swarmion-app`,
          )}
  
        `);
    }
    process.exit();
  } catch {
    // ignore error
  }
};

export default notifyUpdate;
