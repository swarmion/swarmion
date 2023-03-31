import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/contracts/index.ts', 'src/features/index.ts'],
  silent: true,
  format: ['cjs', 'esm'],
  outDir: 'dist',
});
