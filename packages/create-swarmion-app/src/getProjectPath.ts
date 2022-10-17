import chalk from 'chalk';
import { program } from 'commander';
import path from 'path';
// eslint-disable-next-line import/no-named-as-default
import prompts from 'prompts';

import { validateNpmName } from 'helpers';

const getProjectPath = async (
  argProjectPath: string | undefined,
): Promise<string> => {
  let projectPath = argProjectPath;
  if (typeof projectPath === 'string') {
    projectPath = projectPath.trim();
  }

  if (projectPath === undefined || projectPath === '') {
    const pathRes = await prompts({
      type: 'text',
      name: 'path',
      message: 'What is your project named?',
      initial: 'my-app',
      validate: (name: string) => {
        const validation = validateNpmName(path.basename(path.resolve(name)));
        if (validation.valid) {
          return true;
        }

        return `Invalid project name: ${validation.problems[0] ?? ''}`;
      },
    });

    if (typeof pathRes.path === 'string') {
      projectPath = pathRes.path.trim();
    }
  }

  if (projectPath === undefined || projectPath === '') {
    console.log(`
          
          Please specify the project directory:
          ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}
          
          For example:
          ${chalk.cyan(program.name())} ${chalk.green('my-swarmion-app')}
          
          Run ${chalk.cyan(`${program.name()} --help`)} to see all options.
        `);
    process.exit(1);
  }

  return projectPath;
};

export default getProjectPath;
