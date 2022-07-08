# :sparkles: :rocket: Serverless CDK Bridge Plugin :rocket: :sparkles:

> _Provision resources using the AWS CDK (SQS, Dynamodb, etc.) and reference them in the Serverless framework (lambdas and configuration's `serverless.ts`)._

## :muscle: Motivation :muscle:

When using Serverless framework along with AWS, one often runs into needing to provision resources that aren't covered by the framework (e.g. SQS, DynamoDB). This problem can be solved using AWS Cloudformation, or AWS CDK, among many other options.

1. The main resulting issue is the following: How can one reference the resources created outside of Serverless framework?

2. Moreover, how does one reference lambdas provisioned in the Serverless framework lifecycle inside their custom resources?

These two challenges motivated the development of the Serverless-CDK Bridge.

## :gift: DX Gains :gift:

- Developers that were using Cloudformation to provision resources that Serverless Framework does not manage can now use the AWS CDK. It is a more efficient and DX-friendly option.

- Developers that were using the AWS CDK won't need to "transpile" their CDK constructs' code into Cloudformation before the Serverless Framework deploy step. This saves them a lot of boilerplate fatigue.

## :raised_hands: Caveats :raised_hands:

- The Serverless CDK bridge plugin is only available for Serverless framework Typescript users, as it relies on the existence of a `serverless.ts` file at the root of any service to function.

- The plugin does not yet allow for referencing lambda resources coming from Serverless framework inside CDK construct code. This feature will be available in a second release.

---

### Use-case examples

<img width="500" height="500" src="./static/lambda-sqs-lambda.drawio.svg"/>

#### Code example:

Here's a short code snippet to demonstrate how to use the plugin. Code snippets are taken from the [integrationTests](./integrationTests/) folder.

Typically you would create a construct in the desired folder. For instance, a DynamoDB construct.

```ts
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class MyConstruct extends Construct {
  public dynamodbArn: string;
  public dynamodbName: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const { tableArn, tableName } = new Table(this, 'OrchestratorTable', {
      partitionKey: { name: 'PK', type: AttributeType.STRING },
      sortKey: { name: 'SK', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    this.dynamodbArn = tableArn;
    this.dynamodbName = tableName;
  }
}
```

Then, you would pass the construct to the `serverless.ts` file at the cdkConstruct key:

```ts
const serverlessConfiguration: AWS & CdkPluginConfig = {
  service: 'test-app',
  configValidationMode: 'error',
  plugins: ['../../src'],
  provider: {
    name: 'aws',
  },
  // Other properties ...
  cdkConstruct: MyConstruct,
};
```

And that's it! You can now reference your DynamoDB in your Serverless framework code seamlessly (e.g. in your lambdas).

```ts
const serverlessConfiguration: AWS & CdkPluginConfig = {
  // Other properties ...
  functions: {
    testFunction: {
      environment: {
        ORCHESTRATOR_TABLE_NAME: getCdkProperty<MyConstruct>('dynamodbName'),
        ORCHESTRATOR_TABLE_ARN: getCdkProperty<MyConstruct>('dynamodbArn'),
      },
      handler: './lambda.js',
    },
  },
  // ...
};
```
