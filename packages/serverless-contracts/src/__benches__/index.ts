import { withCodSpeed } from '@codspeed/tinybench-plugin';
import { Bench } from 'tinybench';

import {
  basicHttpApiHandlerBench,
  bigHttpApiHandlerBench,
} from 'contracts/apiGateway/__benches__';
import {
  basicEventBridgeHandlerBench,
  bigEventBridgeHandlerBench,
} from 'contracts/eventBridge/__benches__';

const bench = withCodSpeed(new Bench());

bench
  .add(
    'ApiGatewayContract > basic handler instantiation',
    basicHttpApiHandlerBench.instantiation,
  )
  .add(
    'ApiGatewayContract > basic handler invocation',
    basicHttpApiHandlerBench.invocation,
  )
  .add(
    'ApiGatewayContract > handler with 500 properties instantiation',
    bigHttpApiHandlerBench.instantiation,
  )
  .add(
    'ApiGatewayContract > handler with 500 properties invocation',
    bigHttpApiHandlerBench.invocation,
  )
  .add(
    'EventBridgeContract > basic handler instantiation',
    basicEventBridgeHandlerBench.instantiation,
  )
  .add(
    'EventBridgeContract > basic handler invocation',
    basicEventBridgeHandlerBench.invocation,
  )
  .add(
    'EventBridgeContract > handler with 200 properties instantiation',
    bigEventBridgeHandlerBench.instantiation,
  )
  .add(
    'EventBridgeContract > handler with 200 properties invocation',
    bigEventBridgeHandlerBench.invocation,
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
