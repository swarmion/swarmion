import { requestSyncDeployment } from '@swarmion/orchestrator-contracts';
import { applyHttpMiddlewares } from '@swarmion/serverless-helpers';

import ServiceEventEntity from 'libs/models/serviceEvent';

const handler = requestSyncDeployment.handler(async event => {
  const { serviceId, applicationId } = event.body;

  const timestamp = new Date().toISOString();

  await ServiceEventEntity.put({ serviceId, applicationId, timestamp });

  return { status: 'ACCEPTED', message: 'processing' };
});

export const main = applyHttpMiddlewares(handler, {
  inputSchema: requestSyncDeployment.inputSchema,
  outputSchema: requestSyncDeployment.outputSchema,
});
