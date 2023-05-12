import {
  getAPIGatewayEventHandlerContextMock,
  getAPIGatewayEventRequestContextMock,
} from '@swarmion/serverless-helpers';

import { handler } from './handler';

describe('health handler', () => {
  it('should return "ok"', async () => {
    expect(
      await handler(
        {
          body: null,
          headers: {},
          multiValueHeaders: {},
          httpMethod: '',
          isBase64Encoded: false,
          path: '',
          pathParameters: null,
          queryStringParameters: null,
          multiValueQueryStringParameters: null,
          stageVariables: null,
          requestContext: getAPIGatewayEventRequestContextMock(),
          resource: '',
        },
        getAPIGatewayEventHandlerContextMock(),
        () => null,
      ),
    ).toMatchObject({
      statusCode: 200,
      body: JSON.stringify({ message: 'ok' }),
    });
  });
});
