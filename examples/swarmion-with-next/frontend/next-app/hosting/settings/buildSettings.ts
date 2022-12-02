export const buildSettings = {
  version: '1.0',
  applications: [
    {
      appRoot: 'frontend/next-app',
      frontend: {
        phases: {
          preBuild: {
            commands: [
              'nvm install',
              // Avoid out of memory error. See https://cloudnamaste.com/amplify-console-build-fail-java-heap-out-of-memory/
              'export NODE_OPTIONS=--max-old-space-size=8192',
              'npm install -g pnpm',
              // Ensure node_modules in the monorepo root folder are included in the artifacts
              'pnpm install --virtual-store-dir frontend/next-app/node_modules/.pnpm',
            ],
          },
          build: {
            commands: ['pnpm build'],
          },
        },
        artifacts: {
          baseDirectory: '.next',
          files: ['**/*'],
        },
      },
    },
  ],
};
