import DynamoDB from 'aws-sdk/clients/dynamodb';
import { Table } from 'dynamodb-toolbox';

import { PARTITION_KEY, SORT_KEY } from 'resources/dynamodb';

import { ORCHESTRATOR_TABLE_NAME } from './config/dynamodb';

const DocumentClient = new DynamoDB.DocumentClient();

export default new Table({
  name: ORCHESTRATOR_TABLE_NAME,
  partitionKey: PARTITION_KEY,
  sortKey: SORT_KEY,
  autoExecute: true,
  autoParse: true,
  DocumentClient,
});
