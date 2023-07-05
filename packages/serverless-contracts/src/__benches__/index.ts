import { withCodSpeed } from '@codspeed/tinybench-plugin';
import { Bench } from 'tinybench';

import {
  registerBasicHttpApiHandlerBench,
  registerBigHttpApiHandlerBench,
} from 'contracts/apiGateway/__benches__';
import {
  registerBasicEventBridgeHandlerBench,
  registerBigEventBridgeHandlerBench,
} from 'contracts/eventBridge/__benches__';

const bench = withCodSpeed(new Bench());

registerBasicHttpApiHandlerBench(bench);
registerBigHttpApiHandlerBench(bench);

registerBasicEventBridgeHandlerBench(bench);
registerBigEventBridgeHandlerBench(bench);

await bench.run();
console.table(
  bench.tasks.map(({ name, result }) => ({
    'Task Name': name,
    'Average Time (ms)': result?.mean ?? 0,
    Iterations: result?.samples.length,
    'Total Time (ms)': result?.totalTime ?? 0,
  })),
);
