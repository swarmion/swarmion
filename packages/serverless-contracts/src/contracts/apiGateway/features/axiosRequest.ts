import { AxiosInstance, AxiosResponse } from 'axios';

import { GenericApiGatewayContract } from '../apiGatewayContract';
import { OutputType, RequestArguments } from '../types';
import { getRequestParameters } from './requestParameters';

export const getAxiosRequest = async <
  Contract extends GenericApiGatewayContract,
>(
  contract: Contract,
  axiosClient: AxiosInstance,
  requestArguments: RequestArguments<Contract>,
): Promise<AxiosResponse<OutputType<Contract>>> => {
  const { path, method, queryStringParameters, body, headers } =
    getRequestParameters<Contract>(contract, requestArguments);

  return axiosClient.request({
    method,
    url: path,
    headers,
    data: body,
    params: queryStringParameters,
  });
};
