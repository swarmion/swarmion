import { Entity } from 'dynamodb-toolbox';

import { PARTITION_KEY, SORT_KEY } from '../../resources/dynamodb';
import OrchestratorTable from '../orchestratorTable';

const ServiceEventEntity = new Entity({
  name: 'ServiceEvent',
  attributes: {
    [PARTITION_KEY]: {
      partitionKey: true,
      hidden: true,
      default: ({
        serviceId,
        applicationId,
      }: {
        serviceId: string;
        applicationId: string;
      }) => `${applicationId}#SERVICE#${serviceId}`,
    },
    [SORT_KEY]: {
      sortKey: true,
      hidden: true,
      default: ({ timestamp }: { timestamp: string }) => `EVENT#${timestamp}`,
    },
    serviceId: { type: 'string', required: true },
    applicationId: { type: 'string', required: true },
    timestamp: { type: 'string', required: true },
  },
  table: OrchestratorTable,
} as const);

export default ServiceEventEntity;
