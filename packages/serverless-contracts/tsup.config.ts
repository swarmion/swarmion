import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  silent: true,
  format: ['cjs', 'esm'],
  outDir: 'dist',
});
