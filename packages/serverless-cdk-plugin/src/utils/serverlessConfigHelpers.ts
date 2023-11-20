import { Stack } from 'aws-cdk-lib';
import resolveConfigPath from 'serverless/lib/cli/resolve-configuration-path';
import { O } from 'ts-toolbelt';

import { ServerlessConfigFile, ServerlessStack } from 'types';

export const resolveServerlessConfigPath = async (): Promise<string> => {
  return resolveConfigPath();
};

export const getServerlessConfigFile =
  async (): Promise<ServerlessConfigFile> => {
    const configPath = await resolveServerlessConfigPath();

    const serverlessConfigFile =
      (await require(configPath)) as ServerlessConfigFile;

    // Serverless configuration validation does not catch missing property properly
    const uncheckedConfigFile = serverlessConfigFile as O.Partial<
      ServerlessConfigFile,
      'deep'
    >;

    if (uncheckedConfigFile.custom?.cdkPlugin?.stack === undefined) {
      throw new Error('Missing custom.cdkPlugin.stack property');
    }

    const ConfigStack: unknown = serverlessConfigFile.custom.cdkPlugin.stack;

    // Runtime sanity check
    const isStack =
      typeof ConfigStack === 'function' &&
      (ConfigStack.prototype instanceof ServerlessStack ||
        ConfigStack.prototype instanceof Stack);

    if (!isStack) {
      throw new Error('stack should be a ServerlessStack or a Stack');
    }

    return serverlessConfigFile as unknown as ServerlessConfigFile;
  };
