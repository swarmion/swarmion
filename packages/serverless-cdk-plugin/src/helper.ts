import { Construct } from 'constructs';
import * as Serverless from 'serverless';
import { O } from 'ts-toolbelt';

export const getCdkProperty = <T extends Construct>(
  prop: O.SelectKeys<T, string> & string,
): string => {
  return `$\{serverlessCdkBridgePlugin:${prop}}`;
};

export interface ServerlessProps {
  serverless: Serverless;
}

export class ServerlessConstruct extends Construct {
  serverlessProps?: ServerlessProps;

  constructor(scope: Construct, id: string, serverlessProps: ServerlessProps) {
    super(scope, id);

    this.serverlessProps = serverlessProps;
  }
}
