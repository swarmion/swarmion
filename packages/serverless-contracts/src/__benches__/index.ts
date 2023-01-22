import { withCodSpeed } from '@codspeed/tinybench-plugin';
import { Bench } from 'tinybench';

import { basicHttpApiHandler } from './contracts';

const bench = withCodSpeed(new Bench());

bench.add(
  'contracts > ApiGatewayContract > basic handler',
  basicHttpApiHandler,
);

await bench.run();
console.table(
  bench.tasks.map(({ name, result }) => ({
    'Task Name': name,
    'Average Time (ps)': (result?.mean ?? 0) * 1000,
  })),
);
