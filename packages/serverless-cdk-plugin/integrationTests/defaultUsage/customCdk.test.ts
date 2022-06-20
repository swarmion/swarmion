import runServerless from '@serverless/test/run-serverless';
import { Template } from 'aws-cdk-lib/assertions';

describe('customCdK', () => {
  it('should create all required resources', async () => {
    const { cfTemplate } = await runServerless(
      '../../node_modules/serverless',
      {
        command: 'package',
        cwd: __dirname,
      },
    );

    const template = Template.fromJSON(cfTemplate);

    template.resourceCountIs('AWS::DynamoDB::Table', 1);
  });
});
