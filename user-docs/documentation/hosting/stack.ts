import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { StaticSite } from './staticSite';

export class FrontendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new StaticSite(this, 'StaticSite');
  }
}
