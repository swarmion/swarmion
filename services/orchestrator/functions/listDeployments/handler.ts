import { listDeploymentsContract } from '@swarmion/orchestrator-contracts';
import { getHandler, HttpStatusCodes } from '@swarmion/serverless-contracts';

export const main = getHandler(listDeploymentsContract)(async event => {
  const { applicationId } = event.queryStringParameters;
  console.log({ applicationId });
  await Promise.resolve();

  return { statusCode: HttpStatusCodes.OK, body: { id: 'coucou' } };
});
