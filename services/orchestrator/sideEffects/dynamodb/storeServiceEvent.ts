import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { PutItemCommand } from 'dynamodb-toolbox';

import { StoreServiceEventType } from 'interfaces/storeServiceEvent';

import { buildServiceEventEntity } from './serviceEventEntity';

export const buildStoreServiceEvent = (
  documentClient: DynamoDBDocumentClient,
  notificationsTableName: string,
): StoreServiceEventType => {
  const ServiceEventEntity = buildServiceEventEntity(
    documentClient,
    notificationsTableName,
  );

  return async ({ serviceId, applicationId, eventId }) => {
    await ServiceEventEntity.build(PutItemCommand)
      .item({
        serviceId,
        applicationId,
        eventId,
      })
      .send();
  };
};
