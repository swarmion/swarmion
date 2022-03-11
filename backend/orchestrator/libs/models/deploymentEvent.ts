import { Entity } from 'dynamodb-toolbox';

import { PARTITION_KEY, SORT_KEY } from '../../resources/dynamodb';
import DeploymentTable from '../deploymentTable';

const DeploymentEvent = new Entity({
  name: 'DeploymentEvent',
  attributes: {
    [PARTITION_KEY]: {
      partitionKey: true,
      hidden: true,
      default: ({ stackId }: { stackId: string }) => `STACK#${stackId}`,
    },
    [SORT_KEY]: {
      sortKey: true,
      hidden: true,
      default: ({ timestamp }: { timestamp: string }) => `EVENT#${timestamp}`,
    },
    stackId: 'string',
    status: 'string',
    resourceId: 'string',
    timestamp: 'string',
    message: 'string',
  },
  table: DeploymentTable,
} as const);

export default DeploymentEvent;
