import Ajv from 'ajv';

import { getHandlerContextMock } from '__mocks__/requestContext';
import { EventBridgeContract } from 'contracts';
import { getHandler } from 'features';

const ajv = new Ajv({ keywords: ['faker'] });

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

const basicEventBridgeHandlerInstantiation = (): void => {
  getHandler(eventBridgeContract, { ajv })(async event => {
    await Promise.resolve();

    return event.detail.userId;
  });
};

const handler = getHandler(eventBridgeContract, { ajv })(async event => {
  await Promise.resolve();

  return event.detail.userId;
});

const basicEventBridgeHandlerInvocation = async (): Promise<void> => {
  await handler(
    {
      ...baseEvent,
      detail: { userId: 'toto' },
    },
    fakeContext,
    () => null,
  );
};

export default {
  instantiation: basicEventBridgeHandlerInstantiation,
  invocation: basicEventBridgeHandlerInvocation,
};
