import { bench, describe } from 'vitest';

import { getHandlerContextMock } from '__mocks__/requestContext';

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

let handler: typeof import('./basicEventBridge').handler;

describe('basic handler', () => {
  bench('cold start', async () => {
    handler = (await import(`./basicEventBridge`)).handler;
  });

  bench('invocation', async () => {
    await handler(
      {
        ...baseEvent,
        detail: { userId: 'toto' },
      },
      fakeContext,
      () => null,
    );
  });
});
