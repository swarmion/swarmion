import {
  EventBridgeClient,
  PutEventsCommand,
} from '@aws-sdk/client-eventbridge';
import { mockClient } from 'aws-sdk-client-mock';

import { EventBridgeContract } from '../eventBridgeContract';
import { buildPutEvent } from '../features';

const eventBridgeClient = new EventBridgeClient({});
const eventBusName = 'myBusName';

const eventBridgeClientMock = mockClient(EventBridgeClient);
eventBridgeClientMock.on(PutEventsCommand).resolves({});

describe('EventBridge contract putEvent tests', () => {
  beforeEach(() => {
    eventBridgeClientMock.reset();
  });

  it('should call eventBridge with the correct parameters', async () => {
    const eventBridgeContract = new EventBridgeContract({
      id: 'myAwesomeEventBridgeContract',
      sources: ['toto.tata', 'titi.tutu'] as const,
      eventType: 'MY_DETAIL_TYPE',
      payloadSchema: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          myOtherProp: { type: 'string' },
        },
        required: ['userId', 'myOtherProp'],
        additionalProperties: false,
      } as const,
    });

    const myPutEvent = buildPutEvent(eventBridgeContract, {
      source: 'titi.tutu',
      eventBridgeClient,
      eventBusName,
    });

    await myPutEvent({ userId: 'miam', myOtherProp: 'coucou' });

    expect(eventBridgeClientMock.call(0).args[0].input).toEqual({
      Entries: [
        {
          Detail: '{"userId":"miam","myOtherProp":"coucou"}',
          DetailType: 'MY_DETAIL_TYPE',
          EventBusName: 'myBusName',
          Source: 'titi.tutu',
        },
      ],
    });
  });
});
