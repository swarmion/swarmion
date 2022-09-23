import { getHandlerContextMock } from '__mocks__/requestContext';

import { EventBridgeContract } from '../eventBridgeContract';
import { getHandler } from '../features/lambdaHandler';

describe('EventBridgeContract handler test', () => {
  const eventBridgeContract = new EventBridgeContract({
    id: 'myAwesomeEventBridgeContract',
    source: 'toto.tata',
    eventType: 'MY_DETAIL_TYPE',
    payloadSchema: {
      type: 'object',
      properties: { userId: { type: 'string' } },
      required: ['userId'],
      additionalProperties: false,
    } as const,
  });
  const baseEvent = {
    'detail-type': 'MY_DETAIL_TYPE' as const,
    id: 'splof',
    account: '111111',
    version: '',
    time: '',
    region: '',
    resources: [],
    source: 'toto.tata' as const,
  };
  const fakeContext = getHandlerContextMock();

  it('should validate the payload', async () => {
    const handler = getHandler(eventBridgeContract)(async event => {
      await Promise.resolve();

      return event.detail.userId;
    });

    const result = await handler(
      {
        ...baseEvent,
        detail: { userId: 'toto' },
      },
      fakeContext,
      () => null,
    );
    expect(result).toBe('toto');
  });

  it('should throw it the payload is invalid', async () => {
    const handler = getHandler(eventBridgeContract)(async event => {
      await Promise.resolve();

      return event.detail.userId;
    });

    await expect(
      handler(
        {
          ...baseEvent,
          // @ts-expect-error this is a test
          detail: { tata: 'toto' },
        },
        fakeContext,
        () => null,
      ),
    ).rejects.toThrowError();
  });
});
