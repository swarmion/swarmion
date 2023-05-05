import { JSONSchema } from 'json-schema-to-ts';
import { A } from 'ts-toolbelt';

import { HttpStatusCodes } from 'types/http';
import { typeAssert } from 'utils';

import {
  bodySchema,
  headersSchema,
  outputSchema,
  pathParametersSchema,
  queryStringParametersSchema,
} from '../__mocks__/httpApiGatewayContract';
import { FullContractSchemaType } from '../types';

typeAssert<
  A.Extends<
    FullContractSchemaType<
      'path',
      'POST',
      'restApi',
      typeof pathParametersSchema,
      typeof queryStringParametersSchema,
      typeof headersSchema,
      typeof bodySchema,
      { [HttpStatusCodes.OK]: typeof outputSchema }
    >,
    JSONSchema
  >
>();
