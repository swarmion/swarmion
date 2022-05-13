import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';

import { ApiGatewayContract } from '../apiGatewayContract';
import { InputSchemaType } from '../types';

/**
 * Returns the aggregated input schema of an ApiGatewayContract in order to validate the inputs of lambdas.
 *
 * This also enables to infer the type with `json-schema-to-ts`.
 *
 * @param contract your ApiGatewayContract
 */
export const getInputSchema = <Contract extends ApiGatewayContract>(
  contract: Contract,
): InputSchemaType<
  Contract['pathParametersSchema'],
  Contract['queryStringParametersSchema'],
  Contract['headersSchema'],
  Contract['bodySchema'],
  true
> => {
  const properties = omitBy(
    {
      pathParameters: contract.pathParametersSchema,
      queryStringParameters: contract.queryStringParametersSchema,
      headers: contract.headersSchema,
      body: contract.bodySchema,
    } as const,
    isUndefined,
  );

  return {
    type: 'object',
    properties,
    // @ts-ignore here object.keys is not precise enough
    required: Object.keys(properties),
    additionalProperties: true,
  };
};
