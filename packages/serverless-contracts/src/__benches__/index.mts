import { withCodSpeed } from '@codspeed/tinybench-plugin';
import { Bench } from 'tinybench';

const fibonacci = (n: number): number => {
  if (n < 2) {
    return n;
  }

  return fibonacci(n - 1) + fibonacci(n - 2);
};

const bench = withCodSpeed(new Bench());

bench
  .add('fibonacci10', () => {
    fibonacci(10);
  })
  .add('fibonacci15', () => {
    fibonacci(15);
  });

await bench.run();
console.table(
  bench.tasks.map(({ name, result }) => ({
    'Task Name': name,
    'Average Time (ps)': (result?.mean ?? 0) * 1000,
  })),
);
