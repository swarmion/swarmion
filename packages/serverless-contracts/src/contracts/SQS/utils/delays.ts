export const wait = async (ms = 100): Promise<void> =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

export const getExponentialBackoffDelay = (
  retryCount: number,
  baseDelayMs = 1,
): number => baseDelayMs * 10 ** retryCount;
