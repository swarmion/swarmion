import { getHandlerContextMock } from '__mocks__/requestContext';
import { getHandler } from 'features/lambdaHandler';

import { EventBridgeContract } from '../eventBridgeContract';

describe('EventBridgeContract handler test', () => {
  const eventBridgeContract = new EventBridgeContract({
    id: 'myAwesomeEventBridgeContract',
    sources: ['toto.tata'] as const,
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

  it('should not throw it the payload is invalid but validation is disabled in optinos', async () => {
    const handler = getHandler(eventBridgeContract, { validatePayload: false })(
      async event => {
        await Promise.resolve();

        return event.detail;
      },
    );

    const result = await handler(
      {
        ...baseEvent,
        // @ts-expect-error this is a test
        detail: { tata: 'toto' },
      },
      fakeContext,
      () => null,
    );
    expect(result).toEqual({ tata: 'toto' });
  });

  it('should accept additional arguments', async () => {
    const mockSideEffect = vitest.fn(() => 'tata');
    interface SideEffects {
      mySideEffect: () => string;
    }

    const sideEffects = { mySideEffect: mockSideEffect };

    const handler = getHandler(eventBridgeContract)(
      async (
        event,
        _context,
        _callback,
        { mySideEffect }: SideEffects = sideEffects,
      ) => {
        await Promise.resolve();

        const sideEffectRes = mySideEffect();

        return `${event.detail.userId}-${sideEffectRes}`;
      },
    );

    const result = await handler(
      {
        ...baseEvent,
        detail: { userId: 'toto' },
      },
      fakeContext,
      () => null,
    );
    expect(result).toBe('toto-tata');
    expect(mockSideEffect).toHaveBeenCalledOnce();
  });

  it('should allow overriding of additional arguments', async () => {
    const mockSideEffect = vitest.fn(() => 'blob');
    const mockUnusedSideEffect = vitest.fn(() => 'tata');
    interface SideEffects {
      mySideEffect: () => string;
    }

    const handler = getHandler(eventBridgeContract)(
      async (
        event,
        _context,
        _callback,
        { mySideEffect }: SideEffects = { mySideEffect: mockUnusedSideEffect },
      ) => {
        await Promise.resolve();

        const sideEffectRes = mySideEffect();

        return `${event.detail.userId}-${sideEffectRes}`;
      },
    );

    const result = await handler(
      {
        ...baseEvent,
        detail: { userId: 'toto' },
      },
      fakeContext,
      () => null,
      { mySideEffect: mockSideEffect },
    );
    expect(result).toBe('toto-blob');
    expect(mockSideEffect).toHaveBeenCalledOnce();
    expect(mockUnusedSideEffect).toHaveBeenCalledTimes(0);
  });
});
