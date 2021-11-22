# Serverless contracts

Generate and use type-safe contracts between your Serverless services.

## Motivation

When splitting your codebase into multiple services, you need to be able to deploy each service independently. However, how to ensure that each deployment will not impact the behavior of other services?

The proposed solution is to constrain every service to interact with other services through a system of contracts.

Each interaction is inherently asymmetric:

- The **provider** is reponsible for giving resources to other services
- The **consumers** use resources given by the provider

Each service can be both a provider and a consumer for different contracts, but each contract is only provided by a single service.

In order to make these contracts safe, each side of the contract must be able to validate it:

- statically with Typescript
- dynamically with JSONSchema

_As of today, only interactions through ApiGateway's HTTP API and REST API are supported. In the future, CloudFormation import/exports and more will also be supported._

## Defining contracts between services

Let's create our first HttpApi contract. First we will need to define the subschemas for each part of our contract:

- the `path` and the http `method` which will trigger the lambda
- the `integrationType`: `"httpApi"` or `"restApi"`. For more information, see [AWS ApiGateway documentation](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html)
- then the different parts of the http request:
  - the path parameters: `pathParametersSchema`, which must correspond to a `Record<string, string>`
  - the query string parameters: `queryStringParametersSchema`, which must respect the same constraint
  - the headers: `headersSchema`, with the same constraint
  - the body `bodySchema` which is an unconstrained JSON schema
- finally, the `outputSchema` in order to be able to validate the output of the lambda. It is also un unconstrained JSON schema.

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

## Provider-side usage

### Generate the lambda trigger

In the `config.ts` file of our lambda, in the `events` section, we need to use the generated trigger to define the path and method that will trigger the lambda:

```ts
export default {
  environment: {},
  handler: getHandlerPath(__dirname),
  events: [myContract.trigger],
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

TODO

## Consumer-side usage

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
