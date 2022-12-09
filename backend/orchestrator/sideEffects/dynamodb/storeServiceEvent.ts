import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { StoreServiceEventType } from 'interfaces/storeServiceEvent';

import { buildServiceEventEntity } from './serviceEventEntity';

export const buildStoreServiceEvent = (
  documentClient: DocumentClient,
  notificationsTableName: string,
): StoreServiceEventType => {
  const ServiceEventEntity = buildServiceEventEntity(
    documentClient,
    notificationsTableName,
  );

  return async ({ serviceId, applicationId, eventId }) => {
    await ServiceEventEntity.put({ serviceId, applicationId, eventId });
  };
};
