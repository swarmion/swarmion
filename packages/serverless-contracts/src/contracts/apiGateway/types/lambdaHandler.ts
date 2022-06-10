import type {
  APIGatewayEventRequestContextWithAuthorizer,
  APIGatewayProxyCognitoAuthorizer,
} from 'aws-lambda';
import { FromSchema } from 'json-schema-to-ts';

import { ApiGatewayContract } from '../apiGatewayContract';
import { OutputType } from './common';
import { InputSchemaType } from './input';
import type { DefinedProperties } from './utils';

export type HandlerType<Contract extends ApiGatewayContract> = (
  event: DefinedProperties<{
    requestContext: Contract['hasAuthorizer'] extends true
      ? APIGatewayEventRequestContextWithAuthorizer<APIGatewayProxyCognitoAuthorizer>
      : APIGatewayEventRequestContextWithAuthorizer<undefined>;
  }> &
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
