import { listDeploymentsContract } from '@swarmion/orchestrator-contracts';
import { getHandler } from '@swarmion/serverless-contracts';

export const main = getHandler(listDeploymentsContract)(async event => {
  const { applicationId } = event.queryStringParameters;
  console.log({ applicationId });
  await Promise.resolve();

  return { id: 'ACCEPTED' };
});
