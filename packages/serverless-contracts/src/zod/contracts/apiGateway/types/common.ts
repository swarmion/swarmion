import { O } from 'ts-toolbelt';
import { z } from 'zod';

import { ConstrainedZodJsonSchema, ZodJsonSchema } from 'zod/types';

import { GenericApiGatewayContract } from '../apiGatewayContract';

export type PathParametersType<Contract extends GenericApiGatewayContract> =
  Contract['pathParametersSchema'] extends ConstrainedZodJsonSchema
    ? z.infer<Contract['pathParametersSchema']>
    : undefined;

export type QueryStringParametersType<
  Contract extends GenericApiGatewayContract,
> = Contract['queryStringParametersSchema'] extends ConstrainedZodJsonSchema
  ? z.infer<Contract['queryStringParametersSchema']>
  : undefined;

export type HeadersType<Contract extends GenericApiGatewayContract> =
  Contract['headersSchema'] extends ConstrainedZodJsonSchema
    ? z.infer<Contract['headersSchema']>
    : undefined;

export type CustomRequestContextType<
  Contract extends GenericApiGatewayContract,
> = Contract['requestContextSchema'] extends ZodJsonSchema
  ? z.infer<Contract['requestContextSchema']>
  : undefined;

export type BodyType<Contract extends GenericApiGatewayContract> =
  Contract['bodySchema'] extends ZodJsonSchema
    ? z.infer<Contract['bodySchema']>
    : undefined;

export type OutputsType<Contract extends GenericApiGatewayContract> = {
  [StatusCode in keyof Contract['outputSchemas']]: {
    statusCode: StatusCode;
    body: Contract['outputSchemas'][StatusCode] extends ZodJsonSchema
      ? z.infer<Contract['outputSchemas'][StatusCode]>
      : void;
  };
};

export type OutputType<Contract extends GenericApiGatewayContract> = O.UnionOf<
  OutputsType<Contract>
>;
