import { readFileSync, unlinkSync, writeFileSync } from 'fs';
import * as path from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getTestEnvVarParameters } from '../getTestEnvVarParameters';
import type { CacheFileType } from '../syncTestEnvVars';
import { syncTestEnvVars } from '../syncTestEnvVars';

vi.mock('../getTestEnvVarParameters.ts');

const subMinutes = (date: Date, minutes: number): Date => {
  date.setMinutes(date.getMinutes() - minutes);

  return date;
};

const testCachePath = 'test-temp.json';
const absoluteTestCachePath = path.resolve(testCachePath);
const parameters = [
  { Name: '/testEnvVars/TOTO', Value: 'toto' },
  { Name: '/testEnvVars/TATA', Value: 'tata' },
];
const parametersWithScope = [
  { Name: '/testEnvVars/my-scope/TOTO', Value: 'toto' },
  { Name: '/testEnvVars/my-scope/TATA', Value: 'tata' },
  { Name: '/testEnvVars/not-my-scope/TUTU', Value: 'tutu' },
];

const envVars = {
  TOTO: 'toto',
  TATA: 'tata',
};

const createCache = (lastFetchedDate: Date) => {
  writeFileSync(
    absoluteTestCachePath,
    JSON.stringify({ lastFetchedDate, envVars }, null, 2),
  );
};

describe('syncTestEnvVars', () => {
  afterEach(() => {
    delete process.env.TOTO;
    delete process.env.TATA;
    try {
      unlinkSync(absoluteTestCachePath);
    } catch (e) {
      console.log(e);
      // ignore
    }
  });
  describe('when cache is not setup', () => {
    it('gets env vars from SSM', async () => {
      vi.mocked(getTestEnvVarParameters).mockResolvedValue(parameters);
      await syncTestEnvVars({ cacheFilePath: testCachePath });
      expect(getTestEnvVarParameters).toBeCalledTimes(1);
    });
    it('sets env var in process.env from the fetched parameters', async () => {
      vi.mocked(getTestEnvVarParameters).mockResolvedValue(parameters);
      await syncTestEnvVars({ cacheFilePath: testCachePath });
      expect(process.env.TOTO).toBe('toto');
      expect(process.env.TATA).toBe('tata');
    });
    it('sets env var in process.env from the fetched parameters with serviceName', async () => {
      vi.mocked(getTestEnvVarParameters).mockResolvedValue(parametersWithScope);
      await syncTestEnvVars({
        cacheFilePath: testCachePath,
        scope: 'my-scope',
      });
      expect(process.env.TOTO).toBe('toto');
      expect(process.env.TATA).toBe('tata');
      expect(process.env.TUTU).toBeUndefined();
    });
    it('creates a cache file with the env vars', async () => {
      vi.mocked(getTestEnvVarParameters).mockResolvedValue(parameters);
      await syncTestEnvVars({ cacheFilePath: testCachePath });
      const { envVars: cachedEnvVars } = JSON.parse(
        readFileSync(absoluteTestCachePath).toString(),
      ) as CacheFileType;
      expect(cachedEnvVars).toEqual(envVars);
    });
  });
  describe('when cache is older than cacheDuration', () => {
    const cacheDurationInMs = 30 * 60 * 1000; // 30 minutes
    it('gets env vars from SSM', async () => {
      vi.mocked(getTestEnvVarParameters).mockResolvedValue(parameters);
      createCache(subMinutes(new Date(), 31));
      await syncTestEnvVars({
        cacheFilePath: testCachePath,
        cacheDurationInMs,
      });
      expect(getTestEnvVarParameters).toBeCalledTimes(1);
    });
    it('sets env var in process.env from the fetched parameters', async () => {
      vi.mocked(getTestEnvVarParameters).mockResolvedValue(parameters);
      createCache(subMinutes(new Date(), 31));
      await syncTestEnvVars({
        cacheFilePath: testCachePath,
        cacheDurationInMs,
      });
      expect(process.env.TOTO).toBe('toto');
      expect(process.env.TATA).toBe('tata');
    });
    it('creates a cache file with the env vars', async () => {
      vi.mocked(getTestEnvVarParameters).mockResolvedValue(parameters);
      createCache(subMinutes(new Date(), 31));
      await syncTestEnvVars({
        cacheFilePath: testCachePath,
        cacheDurationInMs,
      });
      const { envVars: cachedEnvVars } = JSON.parse(
        readFileSync(absoluteTestCachePath).toString(),
      ) as CacheFileType;
      expect(cachedEnvVars).toEqual(envVars);
    });
  });
  describe('when cache is fresher than cacheDuration', () => {
    it('does not get env vars from SSM', async () => {
      createCache(subMinutes(new Date(), 50));
      await syncTestEnvVars({ cacheFilePath: testCachePath });
      expect(getTestEnvVarParameters).not.toHaveBeenCalled();
    });
    it('sets env var in process.env from the fetched parameters', async () => {
      createCache(subMinutes(new Date(), 50));
      await syncTestEnvVars({ cacheFilePath: testCachePath });
      expect(process.env.TOTO).toBe('toto');
      expect(process.env.TATA).toBe('tata');
    });
  });
});
