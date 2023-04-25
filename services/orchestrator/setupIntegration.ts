import path from 'path';

import { syncTestEnvVars } from '@swarmion/integration-tests';
import { sharedParams } from '@swarmion/serverless-configuration';

if (process.env.CI !== 'true') {
  process.env.AWS_PROFILE ??= sharedParams.dev.profile;
}

await syncTestEnvVars({
  cacheFilePath: path.resolve(__dirname, './testEnvVarsCache.json'),
  scope: 'orchestrator',
});
