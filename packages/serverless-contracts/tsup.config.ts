import { promises as fs } from 'fs';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/test-utils.ts'],
  silent: true,
  format: ['cjs', 'esm'],
  outDir: 'dist',
  onSuccess: async () => {
    await Promise.all([
      fs.copyFile('package.json', 'dist/package.json'),
      fs.copyFile('README.md', 'dist/README.md'),
    ]);
  },
});
