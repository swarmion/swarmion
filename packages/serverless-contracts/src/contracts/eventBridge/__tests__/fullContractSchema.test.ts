import { EventBridgeContract } from '../eventBridgeContract';
import { getFullContractSchema } from '../features';

describe('EventBridge contract fullContract tests', () => {
  it('should generate a proper full Contract', () => {
    const eventBridgeContract = new EventBridgeContract({
      id: 'myAwesomeEventBridgeContract',
      sources: ['toto.tata'] as const,
      eventType: 'MY_DETAIL_TYPE',
      payloadSchema: { type: 'object' } as const,
    });

    const fullContractSchema = getFullContractSchema(eventBridgeContract);
    expect(fullContractSchema).toEqual({
      type: 'object',
      properties: {
        id: { const: 'myAwesomeEventBridgeContract' },
        contractType: { const: 'eventBridge' },
        sources: { enum: ['toto.tata'] },
        eventType: { const: 'MY_DETAIL_TYPE' },
        payloadSchema: { type: 'object' },
      },
      required: ['id', 'contractType', 'sources', 'eventType', 'payloadSchema'],
      additionalProperties: false,
    });
  });
});
