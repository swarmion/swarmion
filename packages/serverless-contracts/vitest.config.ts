import codspeedPlugin from '@codspeed/vitest-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths(), codspeedPlugin()],
  test: {
    coverage: { reporter: ['text-summary', 'lcovonly'] },
    globals: true,
    exclude: [...configDefaults.exclude, '**/*.type.test.ts'],
  },
});
