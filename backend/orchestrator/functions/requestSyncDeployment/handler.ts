import { requestSyncDeployment } from '@swarmion/orchestrator-contracts';

export const main = requestSyncDeployment.handler(async event => {
  await Promise.resolve();

  const { serviceId } = event.body;

  return { serviceId };
});
