# @swarmion/serverless-contracts

Generate and use type-safe contracts between your Serverless services.

This package is part of the [Swarmion](https://github.com/swarmion/swarmion) project. See its documentation for more insights.

- [Installation](#installation)
- [Defining contracts](#defining-contracts)
  - [ApiGateway](#apigateway)
  - [CloudFormation](#cloudformation)
- [About type inference](#about-type-inference)

# Installation

```bash
npm install @swarmion/serverless-contracts
```

or if using yarn

```bash
yarn add @swarmion/serverless-contracts
```

# Defining contracts

## ApiGateway

ApiGateway is an AWS service that makes it possible to trigger lambda functions through HTTP. There are two types of ApiGateways (for more details, see [AWS documentation](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html)):

- HTTP API
- REST API

In our examples, we will use and HTTP API, but it is completely equivalent for REST APIs in terms of contracts.

Let's create our first HttpApi contract. First we will need to define the subschemas for each part of our contract:

- the `id` serves to uniquely identify the contract among all stacks. Please note that this id MUST be unique among all stacks. Use a convention to ensure unicity.
- the `path` and the http `method` which will trigger the lambda
- the `integrationType`: `"httpApi"` or `"restApi"`
- then the different parts of the http request:
  - the path parameters: `pathParametersSchema`, which must correspond to a `Record<string, string>`
  - the query string parameters: `queryStringParametersSchema`, which must respect the same constraint
  - the headers: `headersSchema`, with the same constraint
  - the body `bodySchema` which is an unconstrained JSON schema
- finally, the `outputSchema` in order to be able to validate the output of the lambda. It is also an unconstrained JSON schema.

```ts
const pathParametersSchema = {
  type: 'object',
  properties: { userId: { type: 'string' }, pageNumber: { type: 'string' } },
  required: ['userId', 'pageNumber'],
  additionalProperties: false,
} as const;

const queryStringParametersSchema = {
  type: 'object',
  properties: { testId: { type: 'string' } },
  required: ['testId'],
  additionalProperties: false,
} as const;

const headersSchema = {
  type: 'object',
  properties: { myHeader: { type: 'string' } },
  required: ['myHeader'],
} as const;

const bodySchema = {
  type: 'object',
  properties: { foo: { type: 'string' } },
  required: ['foo'],
} as const;

const outputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
  },
  required: ['id', 'name'],
} as const;

const myContract = new ApiGatewayContract({
  id: 'my-unique-id',
  path: '/users/{userId}',
  method: 'GET',
  integrationType: 'httpApi',
  pathParametersSchema,
  queryStringParametersSchema,
  headersSchema,
  bodySchema,
  outputSchema,
});
```

**Please note:**
In order to properly use Typescript's type inference:

- All the schemas **MUST** be created using the `as const` directive. For more information, see [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts#fromschema)
- If you do not wish to use one of the subschemas, you need to explicitely set it as `undefined` in the contract. For example, in order to define a contract without headers, we need to create it with:

```ts
const myContract = new ApiGatewayContract({
  id: 'my-unique-id',
  path: '/users/{userId}',
  method: 'GET',
  integrationType: 'httpApi',
  pathParametersSchema,
  queryStringParametersSchema,
  headersSchema: undefined,
  bodySchema,
  outputSchema,
});
```

### Provider-side usage

### Generate the lambda trigger

In the `config.ts` file of our lambda, in the `events` section, we need to use the generated trigger to define the path and method that will trigger the lambda:

```ts
export default {
  environment: {},
  handler: getHandlerPath(__dirname),
  events: [myContract.trigger],
};
```

This will only output the `method` and `path`. However, if you need a more fine-grained configuration for your lambda (such as defining an authorizer), you can use the `getCompleteTrigger` method.

```ts
export default {
  environment: {},
  handler: getHandlerPath(__dirname),
  events: [myContract.getCompleteTrigger({ authorizer: 'arn::aws...' })],
};
```

The static typing helps here to prevent accidental overloading of `path` and `method`:

```ts
export default {
  environment: {},
  handler: getHandlerPath(__dirname),
  events: [
    myContract.getCompleteTrigger({
      method: 'delete', // typescript will throw an error
    }),
  ],
};
```

### Validate the lambda

JSON Schemas are compatible with `ajv` and `@middy/validator`. You can use

```ts
myContract.inputSchema;
```

and

```ts
myContract.outputSchema;
```

in order to validate the input and/or the output of your lambda.

### Type the lambda input and output

On the handler side, you can use the `handler` method on the contract to correctly infer the input and output types from the schema.

```ts
const handler = myContract.handler(async event => {
  event.pathParameters.userId; // will have type 'string'

  event.toto; // will fail typing
  event.pathParameters.toto; // will also fail

  return { id: 'coucou', name: 'coucou' }; // also type-safe!
});
```

### Consumer-side usage

Simply call the `axiosRequest` method on the schema.

```ts
await myContract.axiosRequest('https://my-site.com', {
  pathParameters: { userId: '15', pageNumber: '45' },
  headers: {
    myHeader: 'hello',
  },
  queryStringParameters: { testId: 'plop' },
  body: { foo: 'bar' },
});
```

All parameter types will be inferred from the schemas.
The return type will be an axios response of the type inferred from the `outputSchema`.

If you do not wish to use `axios`, you can use the type inference to generate request parameters with:

```ts
myContract.getRequestParameters({
  pathParameters: { userId: '15', pageNumber: '45' },
  headers: {
    myHeader: 'hello',
  },
  queryStringParameters: { testId: 'plop' },
  body: { foo: 'bar' },
});
```

and then use them in your request.

# CloudFormation

AWS CloudFormation is used by the Serverless Framework to manage resources. In certain cases, it may be necessary to share these resources between services. For example, authentication may be handled by a common authorizer, which should not be reimplemented on each service.

The CloudFormation import/export syntax is very specific, but only one information is truly useful: the name of the export. This must be unique across CloudFormation stacks and serves as a global variable name for the related value. The `id` serves to uniquely identify the contract among all stacks. Please note that this id MUST be unique among all stacks. Use a convention to ensure unicity.

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

### Serverless framework

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
const myCloudFormationContract = Fn.importValue(myCloudformationContract.cdkImportValue);
```

# About type inference

TODO
