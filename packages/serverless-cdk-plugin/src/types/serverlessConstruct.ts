import { AWS } from '@serverless/typescript';
import { Construct } from 'constructs';

export type ServerlessCdkPluginConfig = {
  construct: typeof ServerlessConstruct | typeof Construct;
};

export type ServerlessConfigFile = AWS & ServerlessCdkPluginConfig;

export interface ServerlessProps {
  serverless: ServerlessConfigFile;
}

export class ServerlessConstruct extends Construct {
  serverlessProps?: ServerlessProps;

  constructor(scope: Construct, id: string, serverlessProps?: ServerlessProps) {
    super(scope, id);

    this.serverlessProps = serverlessProps;
  }
}
