import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  silent: true,
  format: ['cjs', 'esm'],
  outExtension: ctx => {
    return { js: `.${ctx.format}.js` };
  },
  outDir: 'dist',
});
