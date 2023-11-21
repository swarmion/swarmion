import {
  APIGatewayEventRequestContextJWTAuthorizer,
  APIGatewayEventRequestContextLambdaAuthorizer,
  APIGatewayProxyCognitoAuthorizer,
} from 'aws-lambda';

import { ApiGatewayAuthorizerType } from './constants';

export type AuthorizerContext<AuthorizerType extends ApiGatewayAuthorizerType> =
  AuthorizerType extends 'cognito'
    ? APIGatewayProxyCognitoAuthorizer
    : AuthorizerType extends 'jwt'
      ? APIGatewayEventRequestContextJWTAuthorizer
      : AuthorizerType extends 'lambda'
        ? // We use unknown for now because we would need another schema to define the authorizer context
          APIGatewayEventRequestContextLambdaAuthorizer<unknown>
        : undefined;
