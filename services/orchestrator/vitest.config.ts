import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: { reporter: ['text-summary', 'lcovonly'] },
    globals: true,
    setupFiles: ['vitestFakeEnv'],
    deps: { interopDefault: true }, // this is needed in order to properly resolve aws-sdk submodules
  },
});
