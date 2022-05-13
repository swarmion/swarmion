import { ApiGatewayContract } from '../apiGatewayContract';
import {
  BodyType,
  HeadersType,
  PathParametersType,
  QueryStringParametersType,
} from './common';
import { DefinedProperties } from './utils';

export type RequestArguments<Contract extends ApiGatewayContract> =
  DefinedProperties<{
    pathParameters: PathParametersType<Contract>;
    queryStringParameters: QueryStringParametersType<Contract>;
    headers: HeadersType<Contract>;
    body: BodyType<Contract>;
  }>;
