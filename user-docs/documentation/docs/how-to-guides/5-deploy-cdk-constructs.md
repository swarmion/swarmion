---
sidebar_position: 5
---

# Deploy CDK constructs

## Deploy a simple CDK construct

Include any `Construct` you want to deploy in a `Stack`, and provide the stack in your `serverless.ts` configuration.

:::note
This is only compatible with constructs defined using the CDK V2.
:::

```typescript
import { Stack } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { AWS } from '@serverless/typescript';
import { ServerlessCdkPluginConfig } from '@swarmion/serverless-cdk-plugin';

class MyStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new Table(this, 'MyDynamodbTable', {
      partitionKey: { name: 'PK', type: AttributeType.STRING },
      sortKey: { name: 'SK', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
  }
}

const serverlessConfiguration: AWS & ServerlessCdkPluginConfig = {
  service: "my-cdk-service",

  plugins: [
    // ...
    '@swarmion/serverless-cdk-plugin',
    // ...
  ],
  // provider: {...},
  // functions: {...},
  // resources: {...},
  custom: {
    cdkPlugin: {
      stack: MyStack, // This defines the CDK entry point to the plugin
    },
  },
};
```

## Export information from CDK to serverless

If you need to export any information from the CDK to the serverless framework, you can do so by adding the data to export as a public attribute of your `Stack`, and using `getCdkPropertyHelper`.

```typescript
import { Stack } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { AWS } from '@serverless/typescript';
import ServerlessCdkPlugin, {
  ServerlessCdkPluginConfig,
} from '@swarmion/serverless-cdk-plugin';

class MyStack extends Stack {
  public dynamodbArn: string;
  public dynamodbName: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const table = new Table(this, 'MyDynamodbTable', {
      partitionKey: { name: 'PK', type: AttributeType.STRING },
      sortKey: { name: 'SK', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    this.dynamodbArn = table.tableArn;
    this.dynamodbName = table.tableName;
  }
}

// Argument types are defined by MyStack's public string attributes
const getCdkProperty = ServerlessCdkPlugin.getCdkPropertyHelper<MyStack>;

const serverlessConfiguration: AWS & ServerlessCdkPluginConfig = {
  service: "my-cdk-service",

  plugins: [
    // ...
    '@swarmion/serverless-cdk-plugin',
    // ...
  ],
  // provider: {...},
  functions: {
    myLambda: {
      environment: {
        TABLE_NAME: getCdkProperty('dynamodbName'),
        TABLE_ARN: getCdkProperty('dynamodbArn'),
      },
    },
  },
  // resources: {...},
  custom: {
    cdkPlugin: {
      stack: MyStack,
    },
  },
};
```

## Export information from serverless to CDK

### Using the serverless props

The plugin exposes a `Stack` wrapper to access the config file and the runtime serverless service object if you need it. The example below shows how to retrieve the stage value.

```typescript
import { Construct } from 'constructs';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { AWS } from '@serverless/typescript';
import ServerlessCdkPlugin, {
  ServerlessProps,
  ServerlessCdkPluginConfig,
} from '@swarmion/serverless-cdk-plugin';


class MyStack extends ServerlessCdkPlugin.ServerlessStack {
  constructor(scope: Construct, id: string, serverlessProps: ServerlessProps) {
    super(scope, id);

    new Table(this, 'MyDynamodbTable', {
      tableName: `table-${serverlessProps.service.provider.stage}`,
      partitionKey: { name: 'PK', type: AttributeType.STRING },
      sortKey: { name: 'SK', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy:
        serverlessProps.service.provider.stage === 'production'
          ? RemovalPolicy.RETAIN
          : RemovalPolicy.DESTROY,
    });
  }
}

const serverlessConfiguration: AWS & ServerlessCdkPluginConfig = {
  service: "my-cdk-service",

  plugins: [
    // ...
    '@swarmion/serverless-cdk-plugin',
    // ...
  ],
  // provider: {...},
  // functions: {...},
  // resources: {...},
  custom: {
    cdkPlugin: {
      stack: MyStack, // You can provide either a Stack or a ServerlessStack here
    },
  },
};
```

### Using serverless variables

You can also use serverless variables directly in the CDK, although the previous method should be favored when possible.

:::caution
Some CDK constructs sanity check properties, and may reject names containing serverless variables because they will not be resolved yet.

You can bypass this issue by wrapping the problematic string in [Fn cloudformation functions](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.Fn.html).
:::


```typescript
import { Stack } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

class MyStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new Table(this, 'MyDynamodbTable', {
      tableName: 'table-${sls:stage}', // Use variables as if you were in the serverless config
      partitionKey: { name: 'PK', type: AttributeType.STRING },
      sortKey: { name: 'SK', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
  }
}
```

:::caution
For implementation reasons, to use serverless variables, you need to use a cdk plugin variable at least once in your configuration.

If you use the `getCdkPropertyHelper` in your config, you're all set

You can also add `'${serverlessCdkBridgePlugin:magicValue}'` to any `custom` key of your serverless config.
:::

## Override your CDK stack name

You can use the `stackName` config property to set the stack name used when instantiating your Stack.

```typescript
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AWS } from '@serverless/typescript';
import { ServerlessCdkPluginConfig } from '@swarmion/serverless-cdk-plugin';

class MyStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

const serverlessConfiguration: AWS & ServerlessCdkPluginConfig = {
  service: "my-cdk-service",

  plugins: [
    // ...
    '@swarmion/serverless-cdk-plugin',
    // ...
  ],
  // provider: {...},
  // functions: { ... },
  // resources: {...},
  custom: {
    cdkPlugin: {
      stack: MyStack,
      stackName: 'myStackName', // Optional
    },
  },
};

```

While the actual cloudformation stack name is defined by serverless, This can be useful if you need a bit more control over the logicalId of elements defined in your CDK Stack.  
When undefined, the stack name defaults to the name of the serverless service.

## CDK caveats

The plugin comes with some limitations and will not be able to use some CDK features.

### Bundled lambda functions

Anything that requires the CDK bootstrap stack to be deploy is not available using this plugin.  
For example, `NodeJsLambdaFunction` cannot be used.

If the plugin detects that the generated CDK plans to use the bootstrap stack to deploy, it will throw an error.

### RestApi methods

If you use a restApi defined through serverless and use the CDK to add method and resources to it, the resulting cloudformation will have dependency issues.  
Since the serverless framework is not aware that you added resources, the `Deployment` resource will not depend on the extra method/resources, resulting in uncertainty in your deployment.

You can set the dependency manually by using [serverless-plugin-bind-deployment-id](https://www.npmjs.com/package/serverless-plugin-bind-deployment-id).  
You will need to export the method and manually define the deployment id.

```typescript
const serverlessConfiguration: AWS & ServerlessCdkPluginConfig = {
  service: "my-cdk-construct-service",

  plugins: [
    // ...
    '@swarmion/serverless-cdk-plugin',
    // ...
  ],

  custom: {
    deploymentId: {
      variableSyntax: 'ApiGatewayDeployment',
    },
    cdkPlugin: {
      stack: MyStack, // You can provide either a Stack or a ServerlessStack here
    },
  },

  resources: {
    extensions: {
      ApiGatewayDeployment: {
        DependsOn: [getCdkProperty('myMethodAttribute')],
        ),
      },
    },
  },
};
```
