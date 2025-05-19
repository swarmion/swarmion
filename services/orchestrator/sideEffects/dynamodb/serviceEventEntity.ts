import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Entity, map, string, Table } from 'dynamodb-toolbox';

import { PARTITION_KEY, SORT_KEY } from 'sharedConstants';

export const getServiceEventPK = ({
  serviceId,
  applicationId,
}: {
  serviceId: string;
  applicationId: string;
}): string => `${applicationId}#SERVICE#${serviceId}`;

const getServiceEventSK = ({ eventId }: { eventId: string }): string =>
  `EVENT#${eventId}`;

const ServiceEventTable = new Table({
  partitionKey: { name: PARTITION_KEY, type: 'string' },
  sortKey: { name: SORT_KEY, type: 'string' },
});

const ServiceEventEntity = new Entity({
  name: 'ServiceEvent',
  schema: map({
    serviceId: string().required().key(),
    applicationId: string().required().key(),
    eventId: string().required().key(),
  }),
  table: ServiceEventTable,
  computeKey: ({ serviceId, applicationId, eventId }) => ({
    pk: getServiceEventPK({ serviceId, applicationId }),
    sk: getServiceEventSK({ eventId }),
  }),
});

export const buildServiceEventEntity = (
  documentClient: DynamoDBDocumentClient,
  alchemyTableName: string,
): typeof ServiceEventEntity => {
  try {
    ServiceEventTable.documentClient = documentClient;
    ServiceEventTable.tableName = alchemyTableName;
  } catch {
    console.warn(
      'Entity already has a table assigned to it.',
      'Calling buildEntity more than once is not recommended. Skipping',
    );
  }

  return ServiceEventEntity;
};
