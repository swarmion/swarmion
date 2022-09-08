import { ulid } from 'ulid';

import { requestSyncDeployment } from '@swarmion/orchestrator-contracts';
import { getHandler } from '@swarmion/serverless-contracts';

import ServiceEventEntity from 'libs/dynamodb/models/serviceEvent';

export const main = getHandler(requestSyncDeployment)(async event => {
  const { serviceId, applicationId } = event.body;

  const eventId = ulid();

  await ServiceEventEntity.put({ serviceId, applicationId, eventId });

  return { status: 'ACCEPTED', message: 'processing' };
});
