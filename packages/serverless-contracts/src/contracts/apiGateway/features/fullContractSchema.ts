import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';

import { GenericApiGatewayContract } from '../apiGatewayContract';
import { FullContractSchemaType } from '../types';

/**
 * Returns the aggregated ApiGatewayContract schema in order to validate the inputs of lambdas.
 *
 * This also enables to infer the type with `json-schema-to-ts`.
 *
 *  @param contract your ApiGatewayContract
 */
export const getFullContractSchema = <
  Contract extends GenericApiGatewayContract,
>(
  contract: Contract,
): FullContractSchemaType<
  Contract['path'],
  Contract['method'],
  Contract['integrationType'],
  Contract['pathParametersSchema'],
  Contract['queryStringParametersSchema'],
  Contract['headersSchema'],
  Contract['bodySchema'],
  Contract['outputSchema']
> => {
  const properties = {
    contractId: { const: contract.id },
    contractType: { const: contract.integrationType },
    path: { const: contract.path },
    method: { const: contract.method },
    ...omitBy(
      {
        pathParameters: contract.pathParametersSchema,
        queryStringParameters: contract.queryStringParametersSchema,
        headers: contract.headersSchema,
        body: contract.bodySchema,
        output: contract.outputSchema,
      },
      isUndefined,
    ),
  };

  return {
    type: 'object',
    // @ts-ignore type inference does not work here
    properties,
    // @ts-ignore type inference does not work here
    required: Object.keys(properties),
    additionalProperties: false,
  };
};
