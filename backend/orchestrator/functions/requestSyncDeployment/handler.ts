import { requestSyncDeployment } from '@swarmion/orchestrator-contracts';
import { applyHttpMiddlewares } from '@swarmion/serverless-helpers';

import ServiceEventEntity from 'libs/models/serviceEvent';

const handler = requestSyncDeployment.handler(async event => {
  const { serviceId } = event.body;

  const timestamp = new Date().toUTCString();

  await ServiceEventEntity.put({ serviceId, timestamp });

  return { serviceId };
});

export const main = applyHttpMiddlewares(handler, {
  inputSchema: requestSyncDeployment.inputSchema,
  outputSchema: requestSyncDeployment.outputSchema,
});
