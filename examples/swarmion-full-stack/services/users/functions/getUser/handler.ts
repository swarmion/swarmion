import { getHandler } from '@swarmion/serverless-contracts';

import { getUserContract } from '@swarmion-full-stack/users-contracts';

export const main = getHandler(getUserContract)(async event => {
  const { userId } = event.pathParameters;

  await Promise.resolve({ userId });

  return { userId, userName: 'hello_world' };
});
