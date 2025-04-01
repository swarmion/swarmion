import { Stack } from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path from 'path';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new Function(this, 'Function', {
      runtime: Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: Code.fromAsset(path.join(__dirname, 'lambda')),
    });
  }
}
