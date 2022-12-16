import { listDeploymentsContract } from '@swarmion/orchestrator-contracts';
import { getHandler, StatusCodes } from '@swarmion/serverless-contracts';

export const main = getHandler(listDeploymentsContract)(async event => {
  const { applicationId } = event.queryStringParameters;
  console.log({ applicationId });
  await Promise.resolve();

  return { statusCode: StatusCodes.OK, body: { id: 'coucou' } };
});
