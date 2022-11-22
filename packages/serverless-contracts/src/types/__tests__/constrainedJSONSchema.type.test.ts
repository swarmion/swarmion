import { JSONSchema } from 'json-schema-to-ts';

import { ConstrainedJSONSchema } from '../constrainedJSONSchema';

type Check = ConstrainedJSONSchema extends JSONSchema ? 'pass' : 'fail';

const check: Check = 'pass';
check;
