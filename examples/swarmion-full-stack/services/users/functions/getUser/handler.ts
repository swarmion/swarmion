import { getHandler, HttpStatusCodes } from '@swarmion/serverless-contracts';
import Ajv from 'ajv';

import { getUserContract } from '@swarmion-full-stack/users-contracts';

const ajv = new Ajv();

export const main = getHandler(getUserContract, { ajv })(async event => {
  const { userId } = event.pathParameters;

  await Promise.resolve({ userId });

  return {
    statusCode: HttpStatusCodes.OK,
    body: { userId, userName: 'hello_world' },
  };
});
