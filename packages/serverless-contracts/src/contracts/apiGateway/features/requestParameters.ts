import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';

import { fillPathTemplate } from 'utils';

import { ApiGatewayContract } from '../apiGatewayContract';
import { BodyType, RequestArguments, RequestParameters } from '../types';

export const getRequestParameters = <Contract extends ApiGatewayContract>(
  contract: Contract,
  requestArguments: RequestArguments<Contract>,
): RequestParameters<BodyType<Contract>> => {
  // TODO improve inner typing here
  const { pathParameters, queryStringParameters, headers, body } =
    requestArguments as {
      pathParameters: Record<string, string>;
      queryStringParameters: Record<string, string | undefined>;
      headers: Record<string, string>;
      body: unknown; // we cast at the return of the function anyway
    };

  const path =
    typeof pathParameters !== 'undefined'
      ? fillPathTemplate(contract.path, pathParameters)
      : contract.path;

  return omitBy(
    {
      method: contract.method,
      path,
      body,
      queryStringParameters: omitBy(
        queryStringParameters,
        isUndefined,
      ) as Record<string, string>,
      headers: { ...headers, 'Content-Type': 'application/json' },
    },
    isUndefined,
  ) as unknown as RequestParameters<BodyType<Contract>>;
};
