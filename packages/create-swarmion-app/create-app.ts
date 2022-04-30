import retry from 'async-retry';
import chalk from 'chalk';
import path from 'path';
import {
  downloadAndExtractRepo,
  getRepoInfo,
  hasRepo,
} from './helpers/examples';
import { makeDir } from './helpers/make-dir';
import { install } from './helpers/install';
import { isFolderEmpty } from './helpers/is-folder-empty';
import { isWriteable } from './helpers/is-writeable';
import { renameProject } from './helpers/renameProject';

export class DownloadError extends Error {}

export const createApp = async ({
  appPath,
}: {
  appPath: string;
}): Promise<void> => {
  const example = 'https://github.com/swarmion/template';

  const repoUrl = new URL(example);

  const repoInfo = await getRepoInfo(repoUrl);

  if (!repoInfo) {
    console.error(
      `Found invalid GitHub URL: ${chalk.red(
        `"${example}"`,
      )}. Please fix the URL and try again.`,
    );
    process.exit(1);
  }

  const found = await hasRepo(repoInfo);

  if (!found) {
    console.error(
      `Could not locate the repository for ${chalk.red(
        `"${example}"`,
      )}. Please check that the repository exists and try again.`,
    );
    process.exit(1);
  }

  const root = path.resolve(appPath);

  if (!(await isWriteable(path.dirname(root)))) {
    console.error(
      'The application path is not writable, please check folder permissions and try again.',
    );
    console.error(
      'It is likely you do not have write permissions for this folder.',
    );
    process.exit(1);
  }

  const appName = path.basename(root);

  await makeDir(root);
  if (!isFolderEmpty(root, appName)) {
    process.exit(1);
  }

  console.log(`Creating a new Swarmion app in ${chalk.green(root)}.`);
  console.log();

  // const originalDirectory = process.cwd();

  process.chdir(root);
  /**
   * If an example repository is provided, clone it.
   */
  try {
    console.log(
      `Downloading files from repo ${chalk.cyan(
        example,
      )}. This might take a moment.`,
    );
    console.log();
    await retry(() => downloadAndExtractRepo(root, repoInfo), {
      //@ts-expect-error ts can't resolve types in async-retry lib
      retries: 3,
    });

    renameProject(appName, root);
  } catch (reason) {
    const isErrorLike = (err: unknown): err is { message: string } => {
      return (
        typeof err === 'object' &&
        err !== null &&
        typeof (err as { message?: unknown }).message === 'string'
      );
    };
    throw new DownloadError(
      isErrorLike(reason) ? reason.message : (reason as string),
    );
  }

  console.log('Installing packages. This might take a couple of minutes.');
  console.log();

  await install(root);
  console.log();

  // let cdpath: string;
  // if (path.join(originalDirectory, appName) === appPath) {
  //   cdpath = appName;
  // } else {
  //   cdpath = appPath;
  // }

  console.log(`${chalk.green('Success!')} Created ${appName} at ${appPath}`);
  console.log('Inside that directory, you can run several commands:');
  console.log();

  // TODO: decide what log to show
  //
  // console.log(chalk.cyan(`  yarn dev`));
  // console.log('    Starts the development server.');
  // console.log();
  // console.log(chalk.cyan(`  yarn build`));
  // console.log('    Builds the app for production.');
  // console.log();
  // console.log(chalk.cyan(`  yarn start`));
  // console.log('    Runs the built app in production mode.');
  // console.log();
  // console.log('We suggest that you begin by typing:');
  // console.log();
  // console.log(chalk.cyan('  cd'), cdpath);
  // console.log(`  ${chalk.cyan(`yarn dev`)}`);
  // console.log();
};
