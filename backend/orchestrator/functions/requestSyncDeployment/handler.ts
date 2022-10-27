import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { ulid } from 'ulid';

import {
  onDeploymentRequestedContract,
  requestSyncDeploymentContract,
} from '@swarmion/orchestrator-contracts';
import { buildPutEvent, getHandler } from '@swarmion/serverless-contracts';
import { getEnvVariable } from '@swarmion/serverless-helpers';

import ServiceEventEntity from 'libs/dynamodb/models/serviceEvent';

const eventBridgeClient = new EventBridgeClient({});
const eventBusName = getEnvVariable('EVENT_BUS_NAME');

const putRequestedContractEvent = buildPutEvent(onDeploymentRequestedContract, {
  source: 'swarmion.orchestrator',
  eventBridgeClient,
  eventBusName,
});

export const main = getHandler(requestSyncDeploymentContract)(async event => {
  const { serviceId, applicationId } = event.body;

  const eventId = ulid();

  await ServiceEventEntity.put({ serviceId, applicationId, eventId });

  await putRequestedContractEvent({ serviceId, applicationId, eventId });

  return { status: 'ACCEPTED', message: 'processing' };
});
