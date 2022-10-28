import { getTrigger } from 'features/lambdaTrigger';

import { EventBridgeContract } from '../eventBridgeContract';

describe('EventBridge contract lambdaTrigger tests', () => {
  const eventBridgeContract = new EventBridgeContract({
    id: 'myAwesomeEventBridgeContract',
    sources: ['toto.tata'] as const,
    eventType: 'MY_DETAIL_TYPE',
    payloadSchema: { type: 'object' } as const,
  });

  it('should generate a proper trigger', () => {
    const trigger = getTrigger(eventBridgeContract, {
      eventBus: 'totoBus',
    });
    expect(trigger).toEqual({
      eventBridge: {
        eventBus: 'totoBus',
        pattern: { source: ['toto.tata'], 'detail-type': ['MY_DETAIL_TYPE'] },
      },
    });
  });

  it('should accept a DLQ', () => {
    const trigger = getTrigger(eventBridgeContract, {
      eventBus: 'totoBus',
      deadLetterQueueArn: 'toto',
      retryPolicy: { maximumEventAge: 12 },
    });
    expect(trigger).toEqual({
      eventBridge: {
        eventBus: 'totoBus',
        pattern: { source: ['toto.tata'], 'detail-type': ['MY_DETAIL_TYPE'] },
        deadLetterQueueArn: 'toto',
        retryPolicy: { maximumEventAge: 12 },
      },
    });
  });
});
