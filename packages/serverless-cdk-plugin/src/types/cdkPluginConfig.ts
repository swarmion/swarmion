import { Construct } from 'constructs';

export type CdkPluginConfig = {
  cdkConstruct: typeof Construct;
};
