import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { functions } from 'functions';

const { Health } = functions;

interface CoreProps {
  stage: string;
}

export class CoreStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps & CoreProps) {
    super(scope, id, props);

    new Health(this, 'Health');
  }
}
