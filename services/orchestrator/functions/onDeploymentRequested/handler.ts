import { onDeploymentRequestedContract } from '@swarmion/orchestrator-contracts';
import { getHandler } from '@swarmion/serverless-contracts';

import { ajv } from 'libs/ajv';

export const main = getHandler(onDeploymentRequestedContract, { ajv })(
  async event => {
    const { applicationId, eventId, serviceId } = event.detail;

    await Promise.resolve();

    console.log({ applicationId, eventId, serviceId });
  },
);
