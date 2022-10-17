#!/usr/bin/env node
/* eslint-disable max-lines */
import chalk from 'chalk';
import { Command } from 'commander';
import path from 'path';
// eslint-disable-next-line import/no-named-as-default
import prompts from 'prompts';

import { createApp, DownloadError } from 'create-app';
import getProjectPath from 'getProjectPath';
import getProjectTemplate from 'getProjectTemplate';
import getRef from 'getRef';
import { getPkgManager, validateNpmName } from 'helpers';
import notifyUpdate from 'notifyUpdate';

import packageJson from '../package.json';

const program = new Command(packageJson.name)
  .arguments('[project-directory]')
  .option('-t, --template <template>', 'template choice')
  .option('-s, --sourceRef <sourceRef>', 'example source ref')
  .usage(`${chalk.green('[project-directory]')} [options]`)
  .allowUnknownOption()
  .parse(process.argv);

// eslint-disable-next-line complexity
const run = async (): Promise<void> => {
  const options = program.opts();
  const projectPath = await getProjectPath(program.args[0]);
  const resolvedProjectPath = path.resolve(projectPath);
  const projectName = path.basename(resolvedProjectPath);

  const { valid, problems } = validateNpmName(projectName);
  if (!valid) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${projectName}"`,
      )} because of npm naming restrictions:`,
    );

    problems.forEach(p => console.error(`    ${chalk.red.bold('*')} ${p}`));
    process.exit(1);
  }

  const packageManager = getPkgManager();
  if (packageManager !== 'pnpm') {
    console.error('Please use pnpm as package manager with Swarmion.');
    process.exit(1);
  }

  const template = await getProjectTemplate(options.template);

  const ref = getRef(options.sourceRef);

  try {
    await createApp({
      appPath: resolvedProjectPath,
      template,
      ref,
    });
  } catch (reason) {
    if (!(reason instanceof DownloadError)) {
      throw reason;
    }

    const res = await prompts({
      type: 'confirm',
      name: 'builtin',
      message:
        `Could not download Swarmion template because of a connectivity issue between your machine and GitHub.\n` +
        `Do you want to use the default template instead?`,
      initial: true,
    });
    if (res.builtin === undefined || res.builtin === null) {
      throw reason;
    }

    await createApp({
      appPath: resolvedProjectPath,
      template,
      ref,
    });
  }
};

run()
  .then(notifyUpdate)
  .catch(async reason => {
    console.log();
    console.log('Aborting installation.');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (reason.command as boolean) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log(`  ${chalk.cyan(reason.command as string)} has failed.`);
    } else {
      console.log(chalk.red('Unexpected error. Please report it as a bug:'));
      console.log(reason);
    }
    console.log();

    await notifyUpdate();

    process.exit(1);
  });
