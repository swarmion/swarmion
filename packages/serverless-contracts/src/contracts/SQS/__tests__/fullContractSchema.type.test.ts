import { JSONSchema } from 'json-schema-to-ts';

import { sqsContract } from './mock';
import { FullContractSchemaType } from '../types';

type Check =
  FullContractSchemaType<typeof sqsContract> extends JSONSchema
    ? 'pass'
    : 'fail';

const check: Check = 'pass';
check;
