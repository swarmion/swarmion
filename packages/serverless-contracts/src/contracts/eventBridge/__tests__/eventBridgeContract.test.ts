import { EventBridgeContract } from '../eventBridgeContract';

describe('eventBridgeContract tests', () => {
  it('should be properly initialized', () => {
    const eventBridgeContract = new EventBridgeContract({
      id: 'myAwesomeEventBridgeContract',
      source: 'toto.tata',
      eventType: 'MY_DETAIL_TYPE',
      payloadSchema: { type: 'object' } as const,
    });

    expect(eventBridgeContract.id).toBe('myAwesomeEventBridgeContract');
    expect(eventBridgeContract.source).toBe('toto.tata');
    expect(eventBridgeContract.eventType).toBe('MY_DETAIL_TYPE');
    expect(eventBridgeContract.payloadSchema).toEqual({ type: 'object' });
  });
});
