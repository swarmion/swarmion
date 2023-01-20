import { environmentVariables } from './environmentVariables';

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
              'nvm use',
              // Avoid out of memory error. See https://cloudnamaste.com/amplify-console-build-fail-java-heap-out-of-memory/
              'export NODE_OPTIONS=--max-old-space-size=8192',
              'npm install -g pnpm',
              // Ensure node_modules in the monorepo root folder are included in the artifacts
              'pnpm install --virtual-store-dir frontend/next-app/node_modules/.pnpm',
            ],
          },
          build: {
            commands: [
              // Allow Next.js to access environment variables
              // See https://docs.aws.amazon.com/amplify/latest/userguide/ssr-environment-variables.html
              `env | grep -E '${Object.keys(environmentVariables).join(
                '|',
              )}' >> .env.production`,
              // Build Next.js app
              'pnpm build --no-lint',
            ],
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
