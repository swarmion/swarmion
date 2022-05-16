import { FromSchema } from 'json-schema-to-ts';

import { ApiGatewayContract } from '../apiGatewayContract';
import { OutputType } from './common';
import { InputSchemaType } from './input';

export type HandlerType<Contract extends ApiGatewayContract> = (
  event: FromSchema<
    InputSchemaType<
      Contract['pathParametersSchema'],
      Contract['queryStringParametersSchema'],
      Contract['headersSchema'],
      Contract['bodySchema'],
      false
    >
  >,
) => Promise<OutputType<Contract>>;
