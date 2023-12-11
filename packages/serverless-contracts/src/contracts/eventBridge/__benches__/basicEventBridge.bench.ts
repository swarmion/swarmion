import { build } from 'esbuild';
import path from 'path';
import { bench, describe } from 'vitest';

import { getHandlerContextMock } from '__mocks__/requestContext';

import { handler } from './basicEventBridge';

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

const bundledHandler = await build({
  entryPoints: [path.join(__dirname, 'basicEventBridge.ts')],
  bundle: true,
  write: false,
});
const bundledHandlerString = new TextDecoder().decode(
  bundledHandler.outputFiles[0]?.contents,
);

describe('EventBridge::basic handler', () => {
  bench(
    'bundled cold start',
    () => {
      eval(bundledHandlerString);
    },
    { warmupIterations: 0 },
  );

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
