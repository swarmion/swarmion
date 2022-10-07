import { spawn } from 'cross-spawn';

export const install = (root: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const command = 'pnpm';
    process.chdir(root);

    const args = ['install'];

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
