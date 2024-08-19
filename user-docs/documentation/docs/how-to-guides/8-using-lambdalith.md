---
sidebar_position: 8
---

# Using Lambdaliths

## Why use lambdalith?

Lambdalith is a pattern where a single Lambda function is responsible for handling multiple API Gateway endpoints. This pattern enables you to reduce the number of Lambda functions you need to manage, reducing the number of cold starts and resources in your stack.
To ensure that our lambda still hase a single responsibility, one should limit the number of endpoints that a single lambda handles.

## When to use lambdalith?

Lambdalith is a good pattern to use when you have a large number of endpoints that are related to each other. For example, if you have a REST API that has multiple endpoints for managing users, you could use a single Lambda function to handle all of these endpoints.

## How to use lambdalith?

First, create the `ApiGatewayContract` entities you want your lambda to handle.

### Provision the lambda

Our lambda needs to be triggered by a proxy resource in ApiGateway. Make sure your proxy resource is restrictive enough to only allow the methods you want to handle.
Here is an example of how to provision the lambda using cdk:

```ts
// config.ts
import { HttpApi } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class SwarmionLambda extends Construct {
  public function: NodejsFunction;

  constructor(scope: Construct, id: string, { httpApi }: { httpApi: HttpApi }) {
    super(scope, id);

    this.function = new NodejsFunction(this, 'UsersProxyFunction');

    httpApi.addRoutes({
      path: '/users/{proxy+}',
      integration: new HttpLambdaIntegration(
        'UsersProxyIntegration',
        this.function,
      ),
    });
  }
}
```

### Generate the lambda handler

First you need to define the endpoints your lambda will handle. You can do this using the `SwarmionRouter` and adding your contracts to it. You will benefit the [same type safety as using the `getHandler` utils](./1-use-serverless-contracts/1-api-gateway.md#generate-the-lambda-handler).

```ts
// router.ts

import { SwarmionRouter } from '@swarmion/serverless-contracts';

const router = new SwarmionRouter();

router.add(myContract)(async event => {
  // event is properly typed according to the contract !

  await Promise.resolve(); // you should replace this by your business logic

  return {
    statusCode: HttpStatusCodes.OK,
    headers: { customHeader: 'customHeader' },
    body: { id: 'coucou', name: 'coucou' },
  }; // also type-safe!
});

router.add(userListContract)(async () => {
  // ...
});

router.add(getUserContract)(async () => {
  // ...
});
```

Then you just need to export the handler:

```ts
// handler.ts
import { handle } from '@swarmion/serverless-contracts';
import { router } from './router';

export const main = handle(router);
```

### Additional configuration

As you may know, you can pass an ajv instance when using the `getHandler` utils. This is also possible when instantiating the `SwarmionRouter`:

```ts
import { SwarmionRouter } from '@swarmion/serverless-contracts';
import Ajv from 'ajv';

const myAjvInstance = new Ajv();

const router = new SwarmionRouter({ ajv: myAjvInstance });
```
