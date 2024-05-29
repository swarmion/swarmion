import { APIGatewayProxyEvent } from 'aws-lambda';

import {
  getAPIGatewayEventHandlerContextMock,
  getAPIGatewayEventRequestContextMock,
} from '@swarmion/serverless-helpers';

import { ApiGatewayContract, SwarmionRouter } from 'contracts';

import { handle } from '../features';

describe('handle', () => {
  let router: SwarmionRouter;
  const contract = new ApiGatewayContract({
    id: 'contractId',
    path: '/contract/{id}',
    method: 'GET',
    integrationType: 'httpApi',
  });

  beforeEach(() => {
    router = new SwarmionRouter();
  });

  it('should log the event when logger option is true', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const event = { requestContext: { httpMethod: 'GET' } };

    await handle(router, { logger: true })(
      event,
      getAPIGatewayEventHandlerContextMock(),
      () => {},
    );

    expect(consoleSpy).toHaveBeenCalledWith('event', event);
  });

  it('should return 404 Not found when no route is matched', async () => {
    const event = {
      requestContext: { httpMethod: 'GET' },
      path: '/not-contracts',
    };
    const handler = vi.fn();

    router.add(contract)(handler);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await handle(router, { logger: true })(
      event,
      getAPIGatewayEventHandlerContextMock(),
      () => {},
    );

    expect(result).toEqual({
      statusCode: 404,
      body: 'Not found',
    });
    expect(handler).not.toHaveBeenCalled();
  });

  it('should call the matched handler with the new event', async () => {
    const event = {
      requestContext: getAPIGatewayEventRequestContextMock({
        httpMethod: 'GET',
      }),
      path: '/contract/contractId',
    } satisfies Partial<APIGatewayProxyEvent>;

    const handler = vi.fn();

    router.add(contract)(handler);

    await handle(router)(
      event,
      getAPIGatewayEventHandlerContextMock(),
      () => {},
    );

    expect(handler).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ pathParameters: { id: 'contractId' } }),
      expect.anything(),
      expect.anything(),
    );
  });
  it('should call the correct handler for http', async () => {
    const event = {
      requestContext: getAPIGatewayEventRequestContextMock({
        httpMethod: 'GET',
      }),
      path: '/contract/contractId',
    } satisfies Partial<APIGatewayProxyEvent>;

    const handler = vi.fn();
    const wrongHandler = vi.fn();

    router.add(
      new ApiGatewayContract({
        id: 'wrongContract',
        path: '/wrong/contract',
        method: 'POST',
        integrationType: 'httpApi',
      }),
    )(wrongHandler);

    router.add(contract)(handler);

    await handle(router)(
      event,
      getAPIGatewayEventHandlerContextMock(),
      () => {},
    );

    expect(handler).toHaveBeenCalled();
    expect(wrongHandler).not.toHaveBeenCalled();
  });
});
