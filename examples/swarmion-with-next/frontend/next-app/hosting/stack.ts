import { App } from '@aws-cdk/aws-amplify-alpha';
import { aws_iam, CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { BuildSpec } from 'aws-cdk-lib/aws-codebuild';
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

import {
  branchPreviewConfiguration,
  MAIN_BRANCH,
  mainBranchSettings,
} from './settings/branchSettings';
import { buildSettings } from './settings/buildSettings';
import { environmentVariables } from './settings/environmentVariables';
import { sourceCodeProvider } from './settings/sourceCodeProvider';

const AMPLIFY_APP_NAME = 'NextJS app from CDK';
const AWS_AMPLIFY_RESOURCE_NAME = 'AmplifyAppWithSwarmion';

export class AmplifyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // Amplify service role. Needed to detect NextJs framework. See this issue https://stackoverflow.com/a/69009971
    const role = new aws_iam.Role(this, 'amplify-role-webapp', {
      assumedBy: new aws_iam.ServicePrincipal('amplify.amazonaws.com'),
      description: 'Custom role permitting resources creation from Amplify',
    });

    const iManagedPolicy = aws_iam.ManagedPolicy.fromAwsManagedPolicyName(
      'AdministratorAccess-Amplify',
    );
    role.addManagedPolicy(iManagedPolicy);

    const amplifyApp = new App(this, AWS_AMPLIFY_RESOURCE_NAME, {
      appName: AMPLIFY_APP_NAME,
      description: 'Swarmion NextJS APP deployed with Amplify',
      role,
      sourceCodeProvider,
      environmentVariables,
      buildSpec: BuildSpec.fromObjectToYaml(buildSettings),
      autoBranchCreation: branchPreviewConfiguration,
      autoBranchDeletion: true,
    });
    amplifyApp.addBranch(MAIN_BRANCH, mainBranchSettings);

    new AwsCustomResource(this, 'AmplifySetPlatform', {
      onCreate: {
        service: 'Amplify',
        action: 'updateApp',
        parameters: {
          appId: amplifyApp.appId,
          platform: 'WEB_COMPUTE',
        },
        physicalResourceId: PhysicalResourceId.of(
          'AmplifyCustomResourceSetPlatform',
        ),
      },

      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: [amplifyApp.arn],
      }),
    });

    new CfnOutput(this, 'appId', {
      value: amplifyApp.appId,
    });
  }
}
