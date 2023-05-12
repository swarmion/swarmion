import { Stack, StackProps } from 'aws-cdk-lib';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

import {
  getAppConfig,
  getAppStage,
} from '@swarmion-starter-cdk/cdk-configuration';

import { Health } from 'functions/config';

export class CoreStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const stage = getAppStage(this);
    const {
      restApiConfig: { allowedOrigins },
    } = getAppConfig(this);

    const coreApi = new RestApi(this, 'CoreApi', {
      // the stage of the API is the same as the stage of the stack
      description: `Core API - ${stage}`,
      deployOptions: {
        stageName: stage,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: allowedOrigins,
      },
    });

    new Health(this, 'Health', { restApi: coreApi });
  }
}
