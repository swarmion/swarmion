import middy from '@middy/core';
import cors from '@middy/http-cors';
import { getHandler, HttpStatusCodes } from '@swarmion/serverless-contracts';
import { getEnvVariable } from '@swarmion/serverless-helpers';
import Ajv from 'ajv';

import { healthContract } from '@swarmion-starter/core-contracts';

import { CORS_ALLOWED_ORIGINS } from 'shared/constants';

const ajv = new Ajv();
const allowedOrigins = JSON.parse(
  getEnvVariable(CORS_ALLOWED_ORIGINS),
) as string[];

export const handler = getHandler(healthContract, { ajv })(async () => {
  const body = await Promise.resolve({ message: 'ok' });

  return { statusCode: HttpStatusCodes.OK, body };
});

export const main = middy(handler).use(cors({ origins: allowedOrigins }));
