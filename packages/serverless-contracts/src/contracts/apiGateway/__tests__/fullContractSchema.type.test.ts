import { JSONSchema } from 'json-schema-to-ts';

import { HttpStatusCodes } from 'types/http';

import {
  bodySchema,
  headersSchema,
  outputSchema,
  pathParametersSchema,
  queryStringParametersSchema,
} from '../__mocks__/httpApiGatewayContract';
import { FullContractSchemaType } from '../types';

type Check = FullContractSchemaType<
  'path',
  'POST',
  'restApi',
  typeof pathParametersSchema,
  typeof queryStringParametersSchema,
  typeof headersSchema,
  typeof bodySchema,
  { [HttpStatusCodes.OK]: typeof outputSchema }
> extends JSONSchema
  ? 'pass'
  : 'fail';

const check: Check = 'pass';
check;
