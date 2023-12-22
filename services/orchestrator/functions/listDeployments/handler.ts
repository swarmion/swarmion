import { listDeploymentsContract } from '@swarmion/orchestrator-contracts';
import { getHandler, HttpStatusCodes } from '@swarmion/serverless-contracts';

import { ajv } from 'libs/ajv';

export const main = getHandler(listDeploymentsContract, { ajv })(
  async event => {
    const { applicationId } = event.queryStringParameters;
    console.log({ applicationId });
    await Promise.resolve();

    return {
      statusCode: HttpStatusCodes.OK,
      body: { id: 'coucou' },
      headers: {
        customHeader: 'customHeader',
      },
    };
  },
);
