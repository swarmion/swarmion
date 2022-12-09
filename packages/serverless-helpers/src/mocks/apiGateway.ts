import {
  APIGatewayEventRequestContextV2WithAuthorizer,
  APIGatewayEventRequestContextWithAuthorizer,
  Context,
} from 'aws-lambda';

export const getAPIGatewayEventRequestContextMock = (
  args?: Partial<APIGatewayEventRequestContextWithAuthorizer<undefined>>,
): APIGatewayEventRequestContextWithAuthorizer<undefined> => ({
  accountId: '',
  apiId: '',
  authorizer: undefined,
  protocol: '',
  httpMethod: '',
  identity: {
    accessKey: null,
    accountId: null,
    apiKey: null,
    apiKeyId: null,
    caller: null,
    clientCert: null,
    cognitoAuthenticationProvider: null,
    cognitoAuthenticationType: null,
    cognitoIdentityId: null,
    cognitoIdentityPoolId: null,
    principalOrgId: null,
    sourceIp: 'string',
    user: null,
    userAgent: null,
    userArn: null,
  },
  path: '',
  stage: '',
  requestId: '',
  requestTimeEpoch: 0,
  resourceId: '',
  resourcePath: '',
  ...args,
});

export const getAPIGatewayV2EventRequestContextMock = (
  args?: Partial<APIGatewayEventRequestContextV2WithAuthorizer<undefined>>,
): APIGatewayEventRequestContextV2WithAuthorizer<undefined> => ({
  authorizer: undefined,
  accountId: '',
  apiId: '',
  domainName: '',
  domainPrefix: '',
  http: {
    method: '',
    path: '',
    protocol: '',
    sourceIp: '',
    userAgent: '',
  },
  requestId: '',
  routeKey: '',
  stage: '',
  time: '',
  timeEpoch: 0,
  ...args,
});

export const getAPIGatewayEventHandlerContextMock = (
  args?: Partial<Context>,
): Context =>
  // @ts-expect-error only partial typing here
  ({
    callbackWaitsForEmptyEventLoop: false,
    functionName: '',
    functionVersion: '',
    invokedFunctionArn: '',
    memoryLimitInMB: '',
    awsRequestId: '',
    logGroupName: '',
    logStreamName: '',
    ...args,
  });
