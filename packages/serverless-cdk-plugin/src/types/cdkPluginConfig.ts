import { ServerlessConstruct } from './serverlessConstruct';

export type CdkPluginConfig = {
  serverlessConstruct: typeof ServerlessConstruct;
};
