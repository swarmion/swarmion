import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  silent: true,
  // eslint doesn't support esm plugins yet
  format: ['cjs'],
  // find-up is esm-only
  noExternal: ['find-up'],
  outDir: 'dist',
});
