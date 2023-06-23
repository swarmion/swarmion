import { execSync } from 'child_process';

export const renameProject = (
  appName: string,
  template: string,
  root: string,
): void => {
  if (template !== appName) {
    execSync(`mv ${template}.code-workspace ${appName}.code-workspace`, {
      stdio: 'ignore',
      cwd: root,
    });
  }
  execSync(
    `grep -rl '${template}' --exclude "pnpm-lock.yaml" | xargs perl -i -pe's/${template}/${appName}/g'`,
    { stdio: 'ignore', cwd: root },
  );
  // Use @ prefix in pnpm-lock to avoid accidental matches in integrity hashes
  execSync(`perl -i -pe's/\\@${template}/\\@${appName}/g' pnpm-lock.yaml`, {
    stdio: 'ignore',
    cwd: root,
  });
};
