import { getCdkHandlerPath } from '@swarmion/serverless-helpers';
import { LambdaIntegration, Resource } from 'aws-cdk-lib/aws-apigateway';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

import { healthContract } from '@swarmion-with-cdk/core-contracts';
import { sharedEsbuildConfig } from '@swarmion-with-cdk/serverless-configuration';

export class Health extends Construct {
  public healthFunction: NodejsFunction;

  constructor(scope: Construct, id: string, props: { apiResource: Resource }) {
    super(scope, id);

    this.healthFunction = new NodejsFunction(this, 'Lambda', {
      entry: getCdkHandlerPath(__dirname),
      handler: 'main',
      runtime: Runtime.NODEJS_16_X,
      architecture: Architecture.ARM_64,
      awsSdkConnectionReuse: true,
      bundling: sharedEsbuildConfig,
    });

    props.apiResource.addMethod(
      healthContract.method,
      new LambdaIntegration(this.healthFunction),
    );
  }
}
