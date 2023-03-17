import fs from 'fs';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  silent: true,
  format: ['cjs', 'esm'],
  outDir: 'dist',
  onSuccess: (): Promise<void> => {
    fs.copyFileSync('package.json', 'dist/package.json');

    return Promise.resolve();
  },
});
