import { execSync } from 'child_process';

export const renameProject = (appName: string, root: string): void => {
  execSync(`mv swarmion-starter.code-workspace ${appName}.code-workspace`, {
    stdio: 'ignore',
    cwd: root,
  });
  execSync(
    `grep -rl 'swarmion-starter'|xargs perl -i -pe's/swarmion-starter/${appName}/g'`,
    { stdio: 'ignore', cwd: root },
  );
};
