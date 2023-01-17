import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ulid } from 'ulid';

import { onDeploymentRequestedContract } from '@swarmion/orchestrator-contracts';
import { buildPutEvent } from '@swarmion/serverless-contracts';
import { getEnvVariable } from '@swarmion/serverless-helpers';

import { buildStoreServiceEvent } from 'sideEffects/dynamodb/storeServiceEvent';

const eventBridgeClient = new EventBridgeClient({});
const documentClient = new DocumentClient();

const eventBusName = getEnvVariable('EVENT_BUS_NAME');
const orchestratorTableName = getEnvVariable('ORCHESTRATOR_TABLE_NAME');

const storeServiceEvent = buildStoreServiceEvent(
  documentClient,
  orchestratorTableName,
);

const putRequestedContractEvent = buildPutEvent(onDeploymentRequestedContract, {
  source: 'swarmion.orchestrator',
  eventBridgeClient,
  eventBusName,
});

export const sideEffects = {
  storeServiceEvent,
  putRequestedContractEvent,
  generateUlid: ulid,
};
