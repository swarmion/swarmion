/// <reference lib="dom" />

import { getRequestParameters } from './requestParameters';
import { GenericApiGatewayContract } from '../apiGatewayContract';
import { OutputType, RequestArguments } from '../types';
import { combineUrls } from '../utils';

export const getFetchRequest = async <
  Contract extends GenericApiGatewayContract,
>(
  contract: Contract,
  fetchFunction: typeof fetch,
  options: RequestArguments<Contract> & { baseUrl?: URL | string },
): Promise<OutputType<Contract>> => {
  const { path, method, queryStringParameters, body, headers } =
    getRequestParameters<Contract>(contract, options);

  let url;
  const searchString = new URLSearchParams(queryStringParameters).toString();

  if (options.baseUrl !== undefined) {
    url = combineUrls(path, options.baseUrl);

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
