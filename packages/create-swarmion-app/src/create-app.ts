import retry from 'async-retry';
import chalk from 'chalk';
import { execSync } from 'child_process';
import path from 'path';

import {
  downloadAndExtractRepo,
  hasRepo,
  install,
  isFolderEmpty,
  isWriteable,
  makeDir,
  renameProject,
  RepoInfo,
  tryGitInit,
} from './helpers';

export class DownloadError extends Error {}

export const createApp = async ({
  appPath,
}: {
  appPath: string;
}): Promise<void> => {
  const example =
    'https://github.com/swarmion/swarmion/tree/main/examples/swarmion-starter';

  const repoInfo: RepoInfo = {
    username: 'swarmion',
    name: 'swarmion',
    branch: 'main',
    filePath: 'examples/swarmion-starter',
  };

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
  console.log('Packaging your app.');
  execSync(`yarn package`, { stdio: [0, 1, 2], cwd: root });
  console.log();
  console.log('Linting your project...');
  console.log();
  execSync(`yarn lint-fix-all`, { stdio: 'ignore', cwd: root });

  console.log();
  console.log('Initializing a git repository...');
  if (tryGitInit(root)) {
    console.log();
  }

  console.log(`${chalk.green('Success!')} Created ${appName} at ${appPath}`);
  console.log('Inside that directory, you can run several commands:');
  console.log();

  // TODO: decide what log to show
  //
  //
  // let cdpath: string;
  // if (path.join(originalDirectory, appName) === appPath) {
  //   cdpath = appName;
  // } else {
  //   cdpath = appPath;
  // }
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
