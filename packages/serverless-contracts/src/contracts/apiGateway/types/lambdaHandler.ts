import type { APIGatewayProxyWithCognitoAuthorizerEvent } from 'aws-lambda';
import { FromSchema } from 'json-schema-to-ts';

import { ApiGatewayContract } from '../apiGatewayContract';
import { OutputType } from './common';
import { InputSchemaType } from './input';

export type HandlerType<Contract extends ApiGatewayContract> = (
  event: (Contract['hasAuthorizer'] extends true
    ? APIGatewayProxyWithCognitoAuthorizerEvent
    : Record<string, never>) &
    FromSchema<
      InputSchemaType<
        Contract['pathParametersSchema'],
        Contract['queryStringParametersSchema'],
        Contract['headersSchema'],
        Contract['bodySchema'],
        false
      >
    >,
) => Promise<OutputType<Contract>>;
