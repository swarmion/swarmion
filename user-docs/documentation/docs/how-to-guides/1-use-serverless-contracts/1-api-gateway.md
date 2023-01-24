---
sidebar_position: 1
---

# Use ApiGateway contracts

ApiGateway is an AWS service that makes it possible to trigger lambda functions through HTTP. There are two types of ApiGateways (for more details, see [AWS documentation](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html)):

- HTTP API
- REST API

In our examples, we will use and HTTP API, but it is completely equivalent for REST APIs in terms of contracts.

Let's create our first HttpApi contract. First we will need to define the subschemas for each part of our contract:

- the `id` serves to uniquely identify the contract among all stacks. Please note that this id MUST be unique among all stacks. Use a convention to ensure uniqueness.
- the `path` and the http `method` which will trigger the lambda
- the `integrationType`: `"httpApi"` or `"restApi"`
- the `authorizerType`: `"cognito"`, `"jwt"`, `"lambda"` or `undefined`
- then the different parts of the HTTP request:
  - the path parameters: `pathParametersSchema`, which must correspond to a `Record<string, string>`
  - the query string parameters: `queryStringParametersSchema`, which must respect the same constraint
  - the headers: `headersSchema`, with the same constraint (and as per [HTTP/2 specification](https://httpwg.org/specs/rfc7540.html#HttpHeaders), they should be lowercase)
  - the requestContext: `requestContextSchema`, which must respect the request context format of your lambda, depending on the integration type and the authorizer type.
  - the body `bodySchema` which is an unconstrained JSON schema
- finally, the `outputSchema` in order to be able to validate the output of the lambda. It is also an unconstrained JSON schema.

```ts
import { ApiGatewayContract } from '@swarmion/serverless-contracts';

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
  properties: { 'my-header': { type: 'string' } }, // Warning: headers must be lowercase in HTTP/2
  required: ['my-header'],
} as const;

const requestContextSchema = {
  type: 'object',
  properties: {
    authorizer: {
      type: 'object',
      properties: {
        claims: {
          type: 'object',
          properties: {
            sub: { type: 'string' },
            email: { type: 'string' },
          },
          required: ['sub', 'email'],
        },
      },
      required: ['claims'],
    },
    required: ['authorizer'],
  },
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
  authorizerType: 'cognito',
  pathParametersSchema,
  queryStringParametersSchema,
  headersSchema,
  requestContextSchema,
  bodySchema,
  outputSchema,
});
```

**Please note:**
In order to properly use Typescript's type inference:

- All the schemas **MUST** be created using the `as const` directive. For more information, see [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts#fromschema)

```ts
import { ApiGatewayContract } from '@swarmion/serverless-contracts';

const myContract = new ApiGatewayContract({
  id: 'my-unique-id',
  path: '/users/{userId}',
  method: 'GET',
  integrationType: 'httpApi',
  pathParametersSchema,
  bodySchema,
});
```

:::caution
If you are using `@swarmion/serverless-contracts@0.17.0` or an older version, you will have to define every property even if they are undefined:

```ts
const myContract = new ApiGatewayContract({
  id: 'my-unique-id',
  path: '/users/{userId}',
  method: 'GET',
  integrationType: 'httpApi',
  authorizerType: undefined,
  pathParametersSchema: undefined,
  queryStringParametersSchema: undefined,
  headersSchema: undefined,
  bodySchema: undefined,
  outputSchema: undefined,
});
```

The ability to omit undefined properties was added in [0.18.0](https://github.com/swarmion/swarmion/releases/tag/v0.18.0).
:::

## Provider-side usage

### Generate the lambda trigger

In the `config.ts` file of our lambda, in the `events` section, we need to use the generated trigger to define the path and method that will trigger the lambda:

```ts
// config.ts
import { getTrigger } from '@swarmion/serverless-contracts';

export default {
  environment: {},
  handler: getHandlerPath(__dirname),
  events: [getTrigger(myContract)],
};
```

This will output the `method` and `path`. However, if you need a more fine-grained configuration for your lambda (such as defining an authorizer), you can use a second method argument.

```ts
// config.ts
import { getTrigger } from '@swarmion/serverless-contracts';

export default {
  environment: {},
  handler: getHandlerPath(__dirname),
  events: [getTrigger(myContract, { authorizer: 'arn::aws...' })],
};
```

The static typing helps here to prevent accidental overloading of `path` and `method`:

```ts
// config.ts
import { getTrigger } from '@swarmion/serverless-contracts';

export default {
  environment: {},
  handler: getHandlerPath(__dirname),
  events: [
    getTrigger(myContract, {
      method: 'delete', // typescript will throw an error
    }),
  ],
};
```

The static typing also enforces authenticated contracts by requiring authorizers.

For an unauthenticated contract: (i.e. that has no `authorizerType`):

```ts
// config.ts
import { getTrigger } from '@swarmion/serverless-contracts';

export default {
  environment: {},
  handler: getHandlerPath(__dirname),
  events: [
    getTrigger(myContract, {
      authorizer: 'arn:aws:...', // typescript will throw an error
    }),
  ],
};
```

For an authenticated contract (i.e. with an `authorizerType` set):

```ts
// config.ts
import { getTrigger } from '@swarmion/serverless-contracts';

export default {
  environment: {},
  handler: getHandlerPath(__dirname),
  events: [
    getTrigger(myContract), // error: typescript will request an authorizer property
  ],
};
```

### Generate the lambda handler

If you use your lambda as an ApiGateway integration, you would typically need to use middlewares to parse the body, validate the input and output formats and serialize the output body. You may also need to handle error cases with specific http status codes.

All this can be directly done directly by using the `getHandler` function that offers all those features.

```ts
import { getHandler } from '@swarmion/serverless-contracts';

const handler = getHandler(myContract)(async event => {
  event.pathParameters.userId; // will have type 'string'
  event.requestContext.authorizer.claims.sub; // will have type 'string'

  event.toto; // will fail typing
  event.pathParameters.toto; // will also fail

  await Promise.resolve(); // you should replace this by your business logic

  return { id: 'coucou', name: 'coucou' }; // also type-safe!
});
```

### Use Middy middlewares

`ApiGatewayContract` is compatible with middy. For example, if you wish to use Middy for Cors and logging:

```ts
import middy from '@middy/core';
import errorLogger from '@middy/error-logger';
import cors from '@middy/http-cors';
import { getHandler } from '@swarmion/serverless-contracts';

const handler = getHandler(myContract)(async event => {
  // my handler...
});

const main = middy(handler).use(cors()).use(errorLogger());
```

### Override default parsing and validation from the contract

JSON Schemas are compatible with `ajv` and `@middy/validator`. You can use

```ts
myContract.inputSchema;
```

and

```ts
myContract.outputSchema;
```

in order to validate the input and/or the output of your lambda.

On the handler side, you can use the `getLambdaHandler` function on the contract to still infer the input and output types from the schema.

:::caution
The `getLambdaHandler` is only a pass-through adding typing capabilities, without any parsing nor validation.

This method is not recommended, use `getHandler` when possible.
:::

In order to safely use `getLambdaHandler` combine it with `applyHttpMiddlewares`

```ts
import { getLambdaHandler } from '@swarmion/serverless-contracts';
import { applyHttpMiddlewares } from '@swarmion/serverless-helpers';

const handler = getLambdaHandler(myContract)(async event => {
  event.pathParameters.userId; // will have type 'string'
  event.requestContext.authorizer.claims.sub; // will have type 'string'

  event.toto; // will fail typing
  event.pathParameters.toto; // will also fail

  await Promise.resolve(); // you should replace this by your business logic

  return { id: 'coucou', name: 'coucou' }; // also type-safe!
});

export const main = applyHttpMiddlewares(handler, {
  inputSchema: myContract.inputSchema,
  outputSchema: myContract.outputSchema, // optional output validation
});
```

## Consumer-side usage

Simply call the `getAxiosRequest` function with the schema.

```ts
import { getAxiosRequest } from '@swarmion/serverless-contracts';

await getAxiosRequest(myContract, axiosClient, {
  pathParameters: { userId: '15', pageNumber: '45' },
  headers: {
    'my-header': 'hello',
  },
  queryStringParameters: { testId: 'plop' },
  body: { foo: 'bar' },
});
```

All parameter types will be inferred from the schemas.
The return type will be an axios response of the type inferred from the `outputSchema`.

If you want to use fetch, you can try the `getFetchRequest` function:

```ts
import { getFetchRequest } from '@swarmion/serverless-contracts';

await getFetchRequest(myContract, fetch, {
  pathParameters: { userId: '15', pageNumber: '45' },
  headers: {
    'my-header': 'hello',
  },
  queryStringParameters: { testId: 'plop' },
  body: { foo: 'bar' },
  baseUrl: 'https://my-site.com',
});
```

All parameter types will be inferred from the schemas.
The return type will be the type inferred from the `outputSchema`.
The fetch function that you provide can be a custom wrapper where you already define the base URL or some headers for example.

If you want to use another request client, you can use the type inference to generate request parameters with:

```ts
import { getRequestParameters } from '@swarmion/serverless-contracts';

getRequestParameters(myContract, {
  pathParameters: { userId: '15', pageNumber: '45' },
  headers: {
    'my-header': 'hello',
  },
  queryStringParameters: { testId: 'plop' },
  body: { foo: 'bar' },
});
```

and then use them in your request.
