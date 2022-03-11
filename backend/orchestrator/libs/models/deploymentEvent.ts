import { Entity } from 'dynamodb-toolbox';

import { PARTITION_KEY, SORT_KEY } from '../../resources/dynamodb';
import OrchestratorTable from '../orchestratorTable';

const ContractEntity = new Entity({
  name: 'Contract',
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
  table: OrchestratorTable,
} as const);

export default ContractEntity;
