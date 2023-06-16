import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import fetch from 'node-fetch';
import { ulid } from 'ulid';
import { afterAll, expect } from 'vitest';

import {
  buildServiceEventEntity,
  getServiceEventPK,
  getServiceEventSK,
} from 'sideEffects/dynamodb/serviceEventEntity';
import { TEST_ENV_VARS } from 'testEnvVars';

const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: {},
});

const ServiceEventEntity = buildServiceEventEntity(
  documentClient,
  TEST_ENV_VARS.TABLE_NAME,
);

const serviceId = 'serviceId';
const applicationId = `application${ulid()}`;

describe('requestSyncDeployment', () => {
  afterAll(async () => {
    const { Items: serviceEvents } = await ServiceEventEntity.query(
      getServiceEventPK({ serviceId, applicationId }),
    );

    await Promise.all(
      (serviceEvents ?? []).map(async serviceEvent =>
        ServiceEventEntity.delete({
          pk: getServiceEventPK(serviceEvent),
          sk: getServiceEventSK(serviceEvent),
        }),
      ),
    );
  });

  it('should put a service event entity inside the orchestrator table', async () => {
    const response = await fetch(
      `${TEST_ENV_VARS.API_URL}/request-sync-deployment`,
      {
        method: 'post',
        body: JSON.stringify({
          serviceId,
          applicationId,
        }),
      },
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({
      status: 'ACCEPTED',
      message: 'processing',
    });
    const { Items: serviceEvents } = await ServiceEventEntity.query(
      getServiceEventPK({ serviceId, applicationId }),
    );
    expect(serviceEvents).toContainEqual({
      applicationId,
      created: expect.any(String) as string,
      entity: 'ServiceEvent',
      eventId: expect.any(String) as string,
      modified: expect.any(String) as string,
      serviceId,
    });
  });
});
