import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: { reporter: ['text-summary', 'lcovonly'] },
    globals: true,
    exclude: [...configDefaults.exclude, '**/*.type.test.ts'],
  },
});
