import { execSync } from 'child_process';

import { Template } from 'templates';

export const renameProject = (
  appName: string,
  template: Template,
  root: string,
): void => {
  execSync(`mv ${template}.code-workspace ${appName}.code-workspace`, {
    stdio: 'ignore',
    cwd: root,
  });
  execSync(
    `grep -rl '${template}'|xargs perl -i -pe's/${template}/${appName}/g'`,
    { stdio: 'ignore', cwd: root },
  );
};
