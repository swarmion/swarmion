/* eslint-disable complexity */
/* eslint-disable import/no-extraneous-dependencies */
import chalk from 'chalk';
import spawn from 'cross-spawn';
import type { PackageManager } from './get-pkg-manager';

interface InstallArgs {
  /**
   * Indicate whether to install packages using npm, pnpm or Yarn.
   */
  packageManager: PackageManager;
  /**
   * Indicate whether there is an active Internet connection.
   */
  isOnline: boolean;
  /**
   * Indicate whether the given dependencies are devDependencies.
   */
  devDependencies?: boolean;
}

/**
 * Spawn a package manager installation with either Yarn or NPM.
 *
 * @returns A Promise that resolves once the installation is finished.
 */
export const install = ({
  packageManager,
  isOnline,
}: InstallArgs): Promise<void> => {
  /**
   * Return a Promise that resolves once the installation is finished.
   */
  return new Promise((resolve, reject) => {
    const command = packageManager;
    const useYarn = packageManager === 'yarn';

    /**
     * If there are no dependencies, run a variation of `{packageManager}
     * install`.
     */
    const args = ['install'];
    if (!isOnline) {
      console.log(chalk.yellow('You appear to be offline.'));
      if (useYarn) {
        console.log(chalk.yellow('Falling back to the local Yarn cache.'));
        console.log();
        args.push('--offline');
      } else {
        console.log();
      }
    }

    /**
     * Spawn the installation process.
     */
    const child = spawn(command, args, {
      stdio: 'inherit',
      env: { ...process.env, ADBLOCK: '1', DISABLE_OPENCOLLECTIVE: '1' },
    });
    child.on('close', (code: number) => {
      if (code !== 0) {
        reject({ command: `${command} ${args.join(' ')}` });

        return;
      }
      resolve();
    });
  });
};
