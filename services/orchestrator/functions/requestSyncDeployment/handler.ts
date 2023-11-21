import { requestSyncDeploymentContract } from '@swarmion/orchestrator-contracts';
import { getHandler, HttpStatusCodes } from '@swarmion/serverless-contracts';

import { GenerateUlidType } from 'interfaces/generateUlid';
import { PutRequestedContractEvent } from 'interfaces/putRequestedContractEvent';
import { StoreServiceEventType } from 'interfaces/storeServiceEvent';
import { ajv } from 'libs/ajv';

import { sideEffects } from './sideEffects';

type SideEffects = {
  storeServiceEvent: StoreServiceEventType;
  putRequestedContractEvent: PutRequestedContractEvent;
  generateUlid: GenerateUlidType;
};

export const main = getHandler(requestSyncDeploymentContract, { ajv })(async (
  event,
  _context,
  _callback,
  {
    putRequestedContractEvent,
    storeServiceEvent,
    generateUlid,
  }: SideEffects = sideEffects,
) => {
  const { serviceId, applicationId } = event.body;
  const eventId = generateUlid();

  await storeServiceEvent({ serviceId, applicationId, eventId });

  await putRequestedContractEvent({ serviceId, applicationId, eventId });

  return {
    statusCode: HttpStatusCodes.OK,
    body: { status: 'ACCEPTED', message: 'processing' },
  };
});
