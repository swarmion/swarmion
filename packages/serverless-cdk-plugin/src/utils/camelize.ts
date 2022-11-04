export const camelize = (s: string): string =>
  s.replace(/-./g, (x: string) =>
    x[1] !== undefined ? x[1].toUpperCase() : x,
  );
