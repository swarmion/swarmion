import { EventBridgeContract } from '../eventBridgeContract';

describe('eventBridgeContract tests', () => {
  it('should be properly initialized', () => {
    const eventBridgeContract = new EventBridgeContract({
      source: 'toto.tata',
      name: 'myAwesomeEventBridgeContract',
    });

    expect(eventBridgeContract.name).toBe('myAwesomeEventBridgeContract');
    expect(eventBridgeContract.source).toBe('toto.tata');
  });
});
