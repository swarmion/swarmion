import { JSONSchema } from 'json-schema-to-ts';

import { getHandlerContextMock } from '__mocks__/requestContext';
import { EventBridgeContract } from 'contracts';
import { getHandler } from 'features';

// object with 200 properties to test the performance
const bigObject: Record<string, JSONSchema> = {};
for (let i = 0; i < 200; i++) {
  bigObject[`prop${i}`] = { type: 'string' };
}

const eventBridgeContract = new EventBridgeContract({
  id: 'myAwesomeEventBridgeContract',
  sources: ['toto.tata'] as const,
  eventType: 'MY_DETAIL_TYPE',
  payloadSchema: {
    type: 'object',
    properties: { userId: { type: 'string' }, ...bigObject },
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

const bigEventBridgeHandler = async (): Promise<void> => {
  // simulate creation of the handler during the cold start
  const handler = getHandler(eventBridgeContract)(async event => {
    await Promise.resolve();

    return event.detail.userId;
  });

  // simulate the handler being called 50 times
  for (let i = 0; i < 50; i++) {
    await handler(
      {
        ...baseEvent,
        detail: { userId: 'toto' },
      },
      fakeContext,
      () => null,
    );
  }
};

export default bigEventBridgeHandler;
