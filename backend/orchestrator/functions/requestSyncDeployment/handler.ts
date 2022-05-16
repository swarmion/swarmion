import { ulid } from 'ulid';

import { requestSyncDeployment } from '@swarmion/orchestrator-contracts';
import { getLambdaHandler } from '@swarmion/serverless-contracts';
import { applyHttpMiddlewares } from '@swarmion/serverless-helpers';

import ServiceEventEntity from 'libs/dynamodb/models/serviceEvent';

const handler = getLambdaHandler(requestSyncDeployment)(async event => {
  const { serviceId, applicationId } = event.body;

  const eventId = ulid();

  await ServiceEventEntity.put({ serviceId, applicationId, eventId });

  return { status: 'ACCEPTED', message: 'processing' };
});

export const main = applyHttpMiddlewares(handler, {
  inputSchema: requestSyncDeployment.inputSchema,
  outputSchema: requestSyncDeployment.outputSchema,
});
