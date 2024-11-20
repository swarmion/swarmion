import type { Parameter } from '@aws-sdk/client-ssm';
import * as console from 'console';
import fs from 'fs';
import * as path from 'path';

import { testEnvVarsParameterPath } from './consts';
import { getTestEnvVarParameters } from './getTestEnvVarParameters';

const defaultCacheFile = 'testEnvVarsCache.json';
const defaultCacheDurationInMs = 1000 * 60 * 60; // 1h

export type CacheFileType = {
  lastFetchedDate: string; // iso string date
  envVars: Record<string, string>;
};

const parseParameterName = (
  parameterName: string,
):
  | { scopePart: string | undefined; namePart: string; isValid: true }
  | { scopePart: unknown; namePart: unknown; isValid: false } => {
  const splitName = parameterName.split('/');

  const [emptyPart, testConstPart] = splitName;
  const namePart = splitName.length === 4 ? splitName[3] : splitName[2];
  const scopePart = splitName.length === 4 ? splitName[2] : undefined;

  if (
    emptyPart === '' &&
    testConstPart !== undefined &&
    testConstPart === testEnvVarsParameterPath &&
    namePart !== undefined
  ) {
    return {
      scopePart,
      namePart,
      isValid: true,
    };
  }

  return {
    scopePart,
    namePart,
    isValid: false,
  };
};
const getEnvVarFromParameter = ({
  parameter: { Name, Value },
  scope,
}: {
  parameter: Parameter;
  scope?: string;
}): Record<string, string> => {
  if (Name === undefined || Value === undefined) {
    throw new Error(
      'Fetched SSM Parameter is invalid. This should not happen.',
    );
  }
  const parsedParameterName = parseParameterName(Name);

  if (!parsedParameterName.isValid) {
    console.warn(
      `Found parameter ${Name} in test env vars path, but it is invalid. Skipping it.`,
    );

    return {};
  }

  const { namePart, scopePart } = parsedParameterName;

  // Filter out variables of other scopes
  if (scope !== undefined && scopePart !== scope) {
    return {};
  }

  return {
    [namePart]: Value,
  };
};
const fetchEnvVars = async (
  scope?: string,
): Promise<Record<string, string>> => {
  const parameters = await getTestEnvVarParameters();

  return parameters.reduce<Record<string, string>>(
    (envVars, parameter) => ({
      ...envVars,
      ...getEnvVarFromParameter({ parameter, scope }),
    }),
    {},
  );
};

const importCacheFile = (cacheFilePath: string): CacheFileType =>
  JSON.parse(fs.readFileSync(cacheFilePath).toString()) as CacheFileType;
const getCacheAgeInMs = (cacheFilePath: string): number | undefined => {
  try {
    const { lastFetchedDate } = importCacheFile(cacheFilePath);

    return new Date().getTime() - new Date(lastFetchedDate).getTime();
  } catch {
    console.warn('Test env vars cache file not found or invalid');

    return undefined;
  }
};

const writeCache = (envVars: Record<string, string>, cacheFilePath: string) => {
  const cache: CacheFileType = {
    lastFetchedDate: new Date().toISOString(),
    envVars,
  };
  fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2));
};

const loadEnvVarsFromCache = (cacheFilePath: string) => {
  const { envVars } = importCacheFile(cacheFilePath);
  Object.assign(process.env, envVars);
};
export const syncTestEnvVars = async ({
  cacheFilePath = defaultCacheFile,
  cacheDurationInMs = defaultCacheDurationInMs,
  scope,
}: {
  cacheFilePath?: string;
  cacheDurationInMs?: number;
  scope?: string;
}): Promise<void> => {
  const absoluteCacheFilePath = path.resolve(cacheFilePath);
  const cacheAge = getCacheAgeInMs(absoluteCacheFilePath);
  if (cacheAge === undefined || cacheAge > cacheDurationInMs) {
    const envVars = await fetchEnvVars(scope);
    writeCache(envVars, absoluteCacheFilePath);
  }
  loadEnvVarsFromCache(absoluteCacheFilePath);
};
