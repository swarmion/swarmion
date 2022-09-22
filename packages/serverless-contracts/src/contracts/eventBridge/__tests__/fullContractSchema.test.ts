import { EventBridgeContract } from '../eventBridgeContract';
import { getFullContractSchema } from '../features';

describe('EventBridge contract fullContract tests', () => {
  it('should generate a proper full Contract', () => {
    const eventBridgeContract = new EventBridgeContract({
      id: 'myAwesomeEventBridgeContract',
      source: 'toto.tata',
      eventType: 'MY_DETAIL_TYPE',
      payloadSchema: { type: 'object' } as const,
    });

    const fullContractSchema = getFullContractSchema(eventBridgeContract);
    expect(fullContractSchema).toEqual({
      type: 'object',
      properties: {
        id: { const: 'myAwesomeEventBridgeContract' },
        contractType: { const: 'eventBridge' },
        source: { const: 'toto.tata' },
        eventType: { const: 'MY_DETAIL_TYPE' },
        payloadSchema: { type: 'object' },
      },
      required: ['id', 'contractType', 'source', 'eventType', 'payloadSchema'],
      additionalProperties: false,
    });
  });
});
