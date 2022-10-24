import { ulid } from 'ulid';

import { requestSyncDeploymentContract } from '@swarmion/orchestrator-contracts';
import { getHandler } from '@swarmion/serverless-contracts';

import ServiceEventEntity from 'libs/dynamodb/models/serviceEvent';

export const main = getHandler(requestSyncDeploymentContract)(async event => {
  const { serviceId, applicationId } = event.body;

  const eventId = ulid();

  await ServiceEventEntity.put({ serviceId, applicationId, eventId });

  return { status: 'ACCEPTED', message: 'processing' };
});
