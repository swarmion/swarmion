import { getHandler, HttpStatusCodes } from '@swarmion/serverless-contracts';

import { getUserContract } from '@swarmion-full-stack/users-contracts';

export const main = getHandler(getUserContract)(async event => {
  const { userId } = event.pathParameters;

  await Promise.resolve({ userId });

  return {
    statusCode: HttpStatusCodes.OK,
    body: { userId, userName: 'hello_world' },
  };
});
