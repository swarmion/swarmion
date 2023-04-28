import { Stack, StackProps } from 'aws-cdk-lib';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

import { Health } from 'functions/config';

interface CoreProps {
  stage: string;
}

export class CoreStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps & CoreProps) {
    super(scope, id, props);

    const { stage } = props;

    const coreApi = new RestApi(this, 'CoreApi', {
      // the stage of the API is the same as the stage of the stack
      description: `Core API - ${stage}`,
      deployOptions: {
        stageName: stage,
      },
    });

    new Health(this, 'Health', { restApi: coreApi });
  }
}
