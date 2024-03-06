import { JSONSchema } from 'json-schema-to-ts';

import { FullContractSchemaType } from '../types';

type Check = FullContractSchemaType<'hello'> extends JSONSchema
  ? 'pass'
  : 'fail';

const check: Check = 'pass';
check;
