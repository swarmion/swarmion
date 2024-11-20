import { spawn } from 'cross-spawn';

export const install = (root: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const command = 'pnpm';
    process.chdir(root);

    const args = ['install', '--frozen-lockfile'];

    const child = spawn(command, args, {
      stdio: 'inherit',
      env: { ...process.env, ADBLOCK: '1', DISABLE_OPENCOLLECTIVE: '1' },
    });
    child.on('close', (code: number) => {
      if (code !== 0) {
        reject(
          new Error(
            'install command failed, please check the logs above for errors',
          ),
        );

        return;
      }
      resolve();
    });
  });
};
