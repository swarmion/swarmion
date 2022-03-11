import { getHandlerPath, LambdaFunction } from '@swarmion/serverless-helpers';

const config: LambdaFunction = {
  environment: {
    DEPLOYMENT_TABLE_NAME: { Ref: 'DeploymentTable' },
  },
  handler: getHandlerPath(__dirname),
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Resource: { 'Fn::GetAtt': ['DeploymentTable', 'Arn'] },
      Action: ['dynamodb:PutItem'],
    },
  ],
  iamRoleStatementsInherit: true,
  events: [
    { sns: { arn: { Ref: 'DeploymentTopic' }, topicName: 'deploymentTopic' } },
  ],
};

export default config;
