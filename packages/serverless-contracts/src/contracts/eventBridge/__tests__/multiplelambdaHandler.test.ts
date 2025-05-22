import Ajv from 'ajv';

import { getHandlerContextMock } from '__mocks__/requestContext';

import { EventBridgeContract } from '../eventBridgeContract';
import { getMultipleEventBridgeHandler } from '../features';

const ajv = new Ajv({ keywords: ['faker'] });

describe('Multiple EventBridgeContract handler test', () => {
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
  const eventBridgeContract2 = new EventBridgeContract({
    id: 'myAwesomeEventBridgeContract',
    sources: ['toto.tata.2'] as const,
    eventType: 'MY_DETAIL_TYPE_2',
    payloadSchema: {
      type: 'object',
      properties: { userId: { type: 'string' }, otherKey: { type: 'string' } },
      required: ['userId'],
      additionalProperties: false,
    } as const,
  });
  const baseEvent2 = {
    'detail-type': 'MY_DETAIL_TYPE_2' as const,
    id: 'splof',
    account: '111111',
    version: '',
    time: '',
    region: '',
    resources: [],
    source: 'toto.tata.2' as const,
  };
  const fakeContext = getHandlerContextMock();

  it('should validate the payload', async () => {
    const handler = getMultipleEventBridgeHandler(
      [eventBridgeContract, eventBridgeContract2],
      {
        ajv,
      },
    )(async event => {
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

    const result2 = await handler(
      {
        ...baseEvent2,
        detail: { userId: 'toto', otherKey: 'otherValue' },
      },
      fakeContext,
      () => null,
    );
    expect(result2).toBe('toto');
  });

  it('should throw it the payload is invalid', async () => {
    const handler = getMultipleEventBridgeHandler(
      [eventBridgeContract, eventBridgeContract2],
      {
        ajv,
      },
    )(async event => {
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

  it('should not throw it the payload is invalid but validation is disabled in options', async () => {
    const handler = getMultipleEventBridgeHandler(
      [eventBridgeContract, eventBridgeContract2],
      {
        validatePayload: false,
      },
    )(async event => {
      await Promise.resolve();

      return event.detail;
    });

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

    const result2 = await handler(
      {
        ...baseEvent2,
        // @ts-expect-error this is a test
        detail: { tata: 'toto' },
      },
      fakeContext,
      () => null,
    );
    expect(result2).toEqual({ tata: 'toto' });
  });

  it('should accept additional arguments', async () => {
    const mockSideEffect = vitest.fn(() => 'tata');
    interface SideEffects {
      mySideEffect: () => string;
    }

    const sideEffects = { mySideEffect: mockSideEffect };

    const handler = getMultipleEventBridgeHandler(
      [eventBridgeContract, eventBridgeContract2],
      {
        ajv,
      },
    )(async (
      event,
      _context,
      _callback,
      { mySideEffect }: SideEffects = sideEffects,
    ) => {
      await Promise.resolve();

      const sideEffectRes = mySideEffect();

      return `${event.detail.userId}-${sideEffectRes}`;
    });

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

    vi.resetAllMocks();
    const result2 = await handler(
      {
        ...baseEvent2,
        detail: { userId: 'toto' },
      },
      fakeContext,
      () => null,
    );
    expect(result2).toBe('toto-tata');
    expect(mockSideEffect).toHaveBeenCalledOnce();
  });

  it('should allow overriding of additional arguments', async () => {
    const mockSideEffect = vitest.fn(() => 'blob');
    const mockUnusedSideEffect = vitest.fn(() => 'tata');
    interface SideEffects {
      mySideEffect: () => string;
    }

    const handler = getMultipleEventBridgeHandler(
      [eventBridgeContract, eventBridgeContract2],
      {
        ajv,
      },
    )(async (
      event,
      _context,
      _callback,
      { mySideEffect }: SideEffects = { mySideEffect: mockUnusedSideEffect },
    ) => {
      await Promise.resolve();

      const sideEffectRes = mySideEffect();

      return `${event.detail.userId}-${sideEffectRes}`;
    });

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

    vi.resetAllMocks();
    const result2 = await handler(
      {
        ...baseEvent2,
        detail: { userId: 'toto' },
      },
      fakeContext,
      () => null,
      { mySideEffect: mockSideEffect },
    );
    expect(result2).toBe('toto-blob');
    expect(mockSideEffect).toHaveBeenCalledOnce();
    expect(mockUnusedSideEffect).toHaveBeenCalledTimes(0);
  });
});
