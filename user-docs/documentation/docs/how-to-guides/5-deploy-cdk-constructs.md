---
sidebar_position: 5
---

# Deploy CDK Constructs

## Deploy a simple CDK construct

Define your CDK construct and provide it in the `construct` key in your `serverless.ts` configuration file.

:::note
This is only compatible with Constructs defined using the CDK V2.
:::

```typescript
import { ServerlessCdkPluginConfig } from '@swarmion/serverless-cdk-plugin';

class MyConstruct extends Construct {
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
  service: "my-cdk-construct-service",

  plugins: [
    ...
    '@swarmion/serverless-cdk-plugin',
    ...
  ],

  provider: {...},
  functions: {...},
  resources: {...},
  construct: MyConstruct, // This defines the CDK entry point to the plugin
};
```

## Export information from CDK to serverless

If you need to export any information from the CDK to the serverless framework, you can do so by defining as a public attribute, and using `getCdkPropertyHelper`.

```typescript
import ServerlessCdkPlugin, {
  ServerlessCdkPluginConfig,
} from '@swarmion/serverless-cdk-plugin';

class MyConstruct extends Construct {
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

// Argument types are defined by MyConstruct's public string attributes
const getCdkProperty = ServerlessCdkPlugin.getCdkPropertyHelper<MyConstruct>;

const serverlessConfiguration: AWS & ServerlessCdkPluginConfig = {
  service: "my-cdk-construct-service",

  plugins: [
    ...
    '@swarmion/serverless-cdk-plugin',
    ...
  ],

  provider: {...},
  functions: {
    myLambda: {
      ...
      environment: {
        TABLE_NAME: getCdkProperty('dynamodbName'),
        TABLE_ARN: getCdkProperty('dynamodbArn'),
      },
      ...
    },
  },
  resources: {...},
  construct: MyConstruct,
};
```

## Export information from serverless to CDK

### Using the serverless props

The plugin exposes a Construct wrapper to access the config file and the runtime serverless service object if you need it. The example below shows how to retrieve the stage value.

```typescript
import ServerlessCdkPlugin, {
  ServerlessProps,
  ServerlessCdkPluginConfig,
} from '@swarmion/serverless-cdk-plugin';


class MyConstruct extends ServerlessCdkPlugin.ServerlessConstruct {
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
  service: "my-cdk-construct-service",

  plugins: [
    ...
    '@swarmion/serverless-cdk-plugin',
    ...
  ],

  provider: {...},
  functions: {...},
  resources: {...},
  construct: MyConstruct, // You can provide either a Construct or a ServerlessConstruct here
};
```

### Using serverless variables

You can also use serverless variables directly in the CDK.

```typescript
class MyConstruct extends Construct {
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

:::warning
For implementation reasons, to use serverless variables, you need to use a cdk plugin variable at least once in your configuration.

If you use the `getCdkPropertyHelper` in your config, you're all set

You can also add `'${serverlessCdkBridgePlugin:magicValue}'` to any `custom` key of your serverless config.
:::

## Deploy multiple CDK Constructs

If you need to deploy multiple constructs, you can follow the example below which defines two Dynamodb tables.

## CDK caveats

### CDK naming limitations

Some CDK constructs sanity check properties, and may reject names containing serverless variables because they will not be resolved yet.

You can bypass this issue by wrapping the problematic string in [Fn cloudformation functions](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.Fn.html).

### RestApi methods

If you use a restApi defined through serverless and use the CDK to add method and resources to it, the resulting cloudformation will have dependency issues.  
Since the serverless framework is not aware that you added resources, the `Deployment` resource will not depend on the extra method/resources, resulting in uncertainty in your deployment.

You can set the dependency manually by using [serverless-plugin-bind-deployment-id](https://www.npmjs.com/package/serverless-plugin-bind-deployment-id).  
You will need to export the method and manually define the deployment id.

```typescript
const serverlessConfiguration: AWS & ServerlessCdkPluginConfig = {
  service: "my-cdk-construct-service",

  plugins: [
    ...
    '@swarmion/serverless-cdk-plugin',
    ...
  ],

  construct: MyConstruct, // You can provide either a Construct or a ServerlessConstruct here

  custom: {
    deploymentId: {
      variableSyntax: 'ApiGatewayDeployment',
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
