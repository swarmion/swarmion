import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    include: [
      '**/*.{integration-test,integration-spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    setupFiles: ['setupIntegration'],
    testTimeout: 100000,
    hookTimeout: 100000,
  },
});
