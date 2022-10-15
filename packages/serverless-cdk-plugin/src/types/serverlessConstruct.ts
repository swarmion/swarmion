import { AWS } from '@serverless/typescript';
import { Construct } from 'constructs';
import Service from 'serverless/classes/Service';

export type ServerlessCdkPluginConfig = {
  construct: typeof ServerlessConstruct | typeof Construct;
};

export type ServerlessConfigFile = AWS & ServerlessCdkPluginConfig;

export interface ServerlessProps {
  config: ServerlessConfigFile;
  service: Service;
}

export class ServerlessConstruct extends Construct {
  serverlessProps?: ServerlessProps;

  constructor(scope: Construct, id: string, serverlessProps?: ServerlessProps) {
    super(scope, id);

    this.serverlessProps = serverlessProps;
  }
}
