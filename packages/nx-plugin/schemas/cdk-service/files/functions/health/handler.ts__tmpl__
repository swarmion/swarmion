import { getHandler, HttpStatusCodes } from '@swarmion/serverless-contracts';

import { healthContract } from 'contracts/healthContract';

export const main = getHandler(healthContract)(async () => {
  const body = await Promise.resolve({ message: 'ok' });

  return { statusCode: HttpStatusCodes.OK, body };
});
