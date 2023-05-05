import { deepMerge } from './deepMerge';

describe('deepMerge', () => {
  it('should merge object using lodash defaults', () => {
    const left = {
      foo: {
        bar: 'baz',
        tap: [1, 2],
      },
      baz: 'qux',
    };

    const right = {
      foo: {
        tap: [3, 4],
      },
      baz: 'quux',
    };

    expect(deepMerge(left, right)).toEqual({
      foo: {
        bar: 'baz',
        tap: [3, 4],
      },
      baz: 'quux',
    });
  });

  it('should merge object keeping right object undefined keys', () => {
    const left = {
      foo: {
        bar: 'baz',
        tap: [1, 2],
      },
      baz: {
        qux: 'quux',
      },
    };

    const right = {
      foo: {
        tap: [3, 4],
      },
      baz: {
        qux: undefined,
      },
    };

    expect(deepMerge(left, right)).toEqual({
      foo: {
        bar: 'baz',
        tap: [3, 4],
      },
      baz: {
        qux: undefined,
      },
    });
  });
});
