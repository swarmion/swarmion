#!/usr/bin/env node
/* eslint-disable max-lines */
/* eslint-disable complexity */
/* eslint-disable import/no-extraneous-dependencies */
import chalk from 'chalk';
import Commander from 'commander';
import path from 'path';
import prompts from 'prompts';
import { createApp } from './create-app';
import { getPkgManager } from './helpers/get-pkg-manager';
import { validateNpmName } from './helpers/validate-pkg';
import packageJson from './package.json';

let projectPath = '';

const program = new Commander.Command(packageJson.name)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .action((name: string) => {
    projectPath = name;
  })
  .parse(process.argv);

const run = async (): Promise<void> => {
  if (typeof projectPath === 'string') {
    projectPath = projectPath.trim();
  }

  if (!projectPath) {
    const res = await prompts({
      type: 'text',
      name: 'path',
      message: 'What is your project named?',
      initial: 'my-app',
      validate: (name: string) => {
        const validation = validateNpmName(path.basename(path.resolve(name)));
        if (validation.valid) {
          return true;
        }

        return 'Invalid project name: ' + validation.problems![0];
      },
    });

    if (typeof res.path === 'string') {
      projectPath = res.path.trim();
    }
  }

  if (!projectPath) {
    console.log();
    console.log('Please specify the project directory:');
    console.log(
      `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`,
    );
    console.log();
    console.log('For example:');
    console.log(
      `  ${chalk.cyan(program.name())} ${chalk.green('my-next-app')}`,
    );
    console.log();
    console.log(
      `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`,
    );
    process.exit(1);
  }

  const resolvedProjectPath = path.resolve(projectPath);
  const projectName = path.basename(resolvedProjectPath);

  const { valid, problems } = validateNpmName(projectName);
  if (!valid) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${projectName}"`,
      )} because of npm naming restrictions:`,
    );

    problems!.forEach(p => console.error(`    ${chalk.red.bold('*')} ${p}`));
    process.exit(1);
  }

  if (program.example === true) {
    console.error(
      'Please provide an example name or url, otherwise remove the example option.',
    );
    process.exit(1);
  }

  const packageManager = getPkgManager();

  if (packageManager !== 'yarn') {
    console.error('Please use yarn to create swarmion app.');
    process.exit(1);
  }

  await createApp({
    appPath: resolvedProjectPath,
    packageManager,
  });
};

run().catch((reason: { command?: string }) => {
  console.log();
  console.log('Aborting installation.');
  if (reason.command !== undefined) {
    console.log(`  ${chalk.cyan(reason.command)} has failed.`);
  } else {
    console.log(chalk.red('Unexpected error. Please report it as a bug:'));
    console.log(reason);
  }
  console.log();

  process.exit(1);
});
