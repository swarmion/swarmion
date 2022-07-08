import { Construct } from 'constructs';
import * as Serverless from 'serverless';

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
