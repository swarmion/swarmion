import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path from 'path';

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new Function(this, 'Function', {
      runtime: Runtime.NODEJS_16_X,
      handler: 'index.handler',
      code: Code.fromAsset(path.join(__dirname, 'lambda')),
    });
  }
}
