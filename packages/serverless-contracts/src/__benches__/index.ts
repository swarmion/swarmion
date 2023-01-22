import { withCodSpeed } from '@codspeed/tinybench-plugin';
import { Bench } from 'tinybench';

import {
  basicEventBridgeHandler,
  basicHttpApiHandler,
  bigEventBridgeHandler,
  bigHttpApiHandler,
} from './contracts';

const bench = withCodSpeed(new Bench());

bench
  .add(
    'ApiGatewayContract > handler instantiated and invoked 50 times',
    basicHttpApiHandler,
  )
  .add(
    'ApiGatewayContract > handler with 500 properties instantiated and invoked 50 times',
    bigHttpApiHandler,
  )
  .add(
    'EventBridgeContract > handler instantiated and invoked 50 times',
    basicEventBridgeHandler,
  )
  .add(
    'EventBridgeContract > handler with 200 properties instantiated and invoked 50 times',
    bigEventBridgeHandler,
  );

await bench.run();
console.table(
  bench.tasks.map(({ name, result }) => ({
    'Task Name': name,
    'Average Time (ms)': result?.mean ?? 0,
    Iterations: result?.samples.length,
    'Total Time (ms)': result?.totalTime ?? 0,
  })),
);
