import { onDeploymentRequestedContract } from '@swarmion/orchestrator-contracts';
import { getHandler } from '@swarmion/serverless-contracts';

export const main = getHandler(onDeploymentRequestedContract)(async event => {
  const { applicationId, eventId, serviceId } = event.detail;

  await Promise.resolve();

  console.log({ applicationId, eventId, serviceId });
});
