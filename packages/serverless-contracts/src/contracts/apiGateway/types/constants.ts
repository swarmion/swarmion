/**
 * The integration type: HTTP API or REST API
 * For more information, see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html
 */
export type ApiGatewayIntegrationType = 'httpApi' | 'restApi';
export type ApiGatewayKey = 'httpApi' | 'http';
export type ApiGatewayAuthorizerType = 'cognito' | 'jwt' | 'lambda' | undefined;
