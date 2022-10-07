import runServerless from '@serverless/test/run-serverless';
import { Template } from 'aws-cdk-lib/assertions';
import { join } from 'path';

describe('customCdK', () => {
  it('should create all required resources', async () => {
    const { cfTemplate } = await runServerless(
      join(__dirname, '../../node_modules/serverless'),
      {
        command: 'package',
        cwd: __dirname,
      },
    );

    const template = Template.fromJSON(cfTemplate);

    // Check that the variable name helper resolves to the correct value.
    const lambda = template.findResources('AWS::Lambda::Function');
    expect(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      lambda.TestFunctionLambdaFunction?.Properties?.Environment?.Variables
        ?.ORCHESTRATOR_TABLE_NAME,
    ).toBe('${serverlessCdkBridgePlugin:dynamodbName}');

    expect(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      lambda.TestFunctionLambdaFunction?.Properties?.Environment?.Variables
        ?.ORCHESTRATOR_TABLE_ARN,
    ).toBe('${serverlessCdkBridgePlugin:dynamodbArn}');

    expect(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      lambda.TestFunctionLambdaFunction?.Properties?.Environment?.Variables
        ?.TEST_OUTPUT_SERVERLESS_CONFIG_VALUE,
    ).toBe('${serverlessCdkBridgePlugin:testServerlessConfigValue}');

    // Check that we created a DynamoDB table
    template.resourceCountIs('AWS::DynamoDB::Table', 1);
  });
});
