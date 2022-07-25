import { Construct } from 'constructs';

import { ServerlessConstruct } from './serverlessConstruct';

export type ServerlessCdkPluginConfig = {
  construct: typeof ServerlessConstruct | typeof Construct;
};
