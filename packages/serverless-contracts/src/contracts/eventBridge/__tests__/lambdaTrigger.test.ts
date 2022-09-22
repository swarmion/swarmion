import { EventBridgeContract } from '../eventBridgeContract';
import { getTrigger } from '../features/lambdaTrigger';

describe('EventBridge contract lambdaTrigger tests', () => {
  it('should generate a proper trigger', () => {
    const eventBridgeContract = new EventBridgeContract({
      id: 'myAwesomeEventBridgeContract',
      source: 'toto.tata',
      eventType: 'MY_DETAIL_TYPE',
      payloadSchema: { type: 'object' } as const,
    });

    const trigger = getTrigger(eventBridgeContract, { eventBus: 'totoBus' });
    expect(trigger).toEqual({
      eventBus: 'totoBus',
      pattern: { source: ['toto.tata'], 'detail-type': ['MY_DETAIL_TYPE'] },
    });
  });
});
