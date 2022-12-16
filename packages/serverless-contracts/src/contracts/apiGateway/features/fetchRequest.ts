/// <reference lib="dom" />

import { ApiGatewayContract } from '../apiGatewayContract';
import { OutputType, RequestArguments } from '../types';
import { getRequestParameters } from './requestParameters';

export const getFetchRequest = async <Contract extends ApiGatewayContract>(
  contract: Contract,
  fetchFunction: typeof fetch,
  options: RequestArguments<Contract> & { baseUrl?: URL | string },
): Promise<OutputType<Contract>> => {
  const { path, method, queryStringParameters, body, headers } =
    getRequestParameters<Contract>(contract, options);

  let url;
  const searchString = new URLSearchParams(queryStringParameters).toString();

  if (options.baseUrl !== undefined) {
    url = new URL(path, options.baseUrl);

    url.search = searchString;
  } else {
    url = `${path}?${searchString}`;
  }

  const response = await fetchFunction(url, {
    method,
    headers,
    body: JSON.stringify(body),
  });

  return {
    statusCode: response.status,
    body: (await response.json()) as OutputType<Contract>['body'],
  } as OutputType<Contract>;
};
