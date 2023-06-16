import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { ulid } from 'ulid';

import { onDeploymentRequestedContract } from '@swarmion/orchestrator-contracts';
import { buildPutEvent } from '@swarmion/serverless-contracts';
import { getEnvVariable } from '@swarmion/serverless-helpers';

import { buildStoreServiceEvent } from 'sideEffects/dynamodb/storeServiceEvent';

const eventBridgeClient = new EventBridgeClient({});

const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: {},
});

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
