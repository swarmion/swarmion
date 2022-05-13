import { ulid } from 'ulid';

import { requestSyncDeployment } from '@swarmion/orchestrator-contracts';
import { getInputSchema, HandlerType } from '@swarmion/serverless-contracts';
import { applyHttpMiddlewares } from '@swarmion/serverless-helpers';

import ServiceEventEntity from 'libs/dynamodb/models/serviceEvent';

const handler: HandlerType<typeof requestSyncDeployment> = async event => {
  const { serviceId, applicationId } = event.body;

  const eventId = ulid();

  await ServiceEventEntity.put({ serviceId, applicationId, eventId });

  return { status: 'ACCEPTED', message: 'processing' };
};

export const main = applyHttpMiddlewares(handler, {
  inputSchema: getInputSchema(requestSyncDeployment),
  outputSchema: requestSyncDeployment.outputSchema,
});
