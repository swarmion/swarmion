---
sidebar_position: 5
---

# Use CloudFormation contracts

AWS CloudFormation is used by the Serverless Framework to manage resources. In certain cases, it may be necessary to share these resources between services. For example, authentication may be handled by a common authorizer, which should not be re-implemented on each service.

The CloudFormation import/export syntax is very specific, but only one information is truly useful: the name of the export. This must be unique across CloudFormation stacks and serves as a global variable name for the related value. The `id` serves to uniquely identify the contract among all stacks. Please note that this id MUST be unique among all stacks. Use a convention to ensure uniqueness.

## Defining a CloudFormation contract

```ts
import { CloudFormationContract } from '@swarmion/serverless-contracts';

const myCloudFormationContract = new CloudFormationContract({
  id: 'a-unique-id',
  name: 'mySuperExport',
});
```

Please note that here the export name is `'mySuperExport'`, and this value must be unique across stacks.

## Using a CloudFormation contract to export a value

In the provider `serverless.ts`, add an `Outputs` key

```ts
const serverlessConfiguration = {
  service: "my-provider-service",

  provider: {...},
  functions: {...},
  resources: {
    Resources: {...}
    Outputs: {
      MyAwesomeExport: myCloudFormationContract.exportValue({
        description: 'A nice description',
        value: { Ref: 'MyResourceLogicalId' },
      }),
    },
  },
};
```

Please note:

- The `Ref` function is here an example, the `CloudFormationContract` is compatible with all [CloudFormation functions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html). Please refer to the documentation for more examples
- Here, the `MyAwesomeExport` key has no importance and is not taken into account for the export

## Using a CloudFormation contract to import a value

### Serverless Framework

In the consumer `serverless.ts`, you can use the import with:

```ts
const serverlessConfiguration = {
  service: 'my-consumer-service',
  functions: {...},
  custom: {
    myImportedValue: myCloudFormationContract.importValue,
  },
};
```

The resolved imported value will be available as `${self:custom.myImportedValue}` in your serverless files. See [the Serverless variables documentation](https://www.serverless.com/framework/docs/providers/aws/guide/variables/#reference-properties-in-serverlessyml).

### CDK

You can also use the import with:

```ts
import { Fn } from 'aws-cdk-lib';

const myCloudFormationContract = Fn.importValue(
  myCloudformationContract.cdkImportValue,
);
```
