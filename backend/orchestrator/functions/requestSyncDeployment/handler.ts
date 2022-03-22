import { requestSyncDeployment } from '@swarmion/orchestrator-contracts';
import { applyHttpMiddlewares } from '@swarmion/serverless-helpers';

const handler = requestSyncDeployment.handler(async event => {
  await Promise.resolve();

  const { serviceId } = event.body;

  return { serviceId };
});

export const main = applyHttpMiddlewares(handler, {
  inputSchema: requestSyncDeployment.inputSchema,
  outputSchema: requestSyncDeployment.outputSchema,
});
