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
- finally, the `outputSchemas` in order to be able to validate the output of the lambda. It is a mapping between http status codes and unconstrained JSON schemas.

```ts
import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

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

const successCaseOutputSchema = {
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
  outputSchemas: {
    [HttpStatusCodes.OK]: successCaseOutputSchema,
  },
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
  outputSchemas,
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
import { getHandler, HttpStatusCodes } from '@swarmion/serverless-contracts';
import { ajv } from 'libs/ajv';

const handler = getHandler(myContract, { ajv })(async event => {
  event.pathParameters.userId; // will have type 'string'
  event.requestContext.authorizer.claims.sub; // will have type 'string'

  event.toto; // will fail typing
  event.pathParameters.toto; // will also fail

  await Promise.resolve(); // you should replace this by your business logic

  return {
    statusCode: HttpStatusCodes.OK,
    headers: { customHeader: 'customHeader' },
    body: { id: 'coucou', name: 'coucou' },
  }; // also type-safe!
});
```

:::info
Regarding the `ajv` option, we advise you to use a singleton instance of ajv that you define in a separate file. This way, you can use the same instance for all your contracts and middlewares.

[See an example](../../how-to-guides/migration-guides/ajv-dependency-injection#share-a-singleton-ajv-instance-across-the-whole-project)
:::

### Input and output validation

By default, the `getHandler` feature will validate both the input and the output of your lambda. If you wish to disable one of those, you can use the optional second argument in the `getHandler` feature.
If you do so, you can omit the `ajv` option.

```ts
import { getHandler } from '@swarmion/serverless-contracts';

const handler = getHandler(myContract, {
  validateInput: false,
  validateOutput: false,
})(async event => {
  // ...
});
```

You can also choose to return the ajv validation errors in the response body:

```ts
import { getHandler } from '@swarmion/serverless-contracts';
import { ajv } from 'libs/ajv';

const handler = getHandler(myContract, {
  ajv,
  returnValidationErrors: true,
})(async event => {
  // ...
});
```

An exemple with this flag would be:

```json
{
  "statusCode": 400,
  "body": {
    "message": "Invalid input",
    "errors": [
      {
        "keyword": "type",
        "dataPath": ".id",
        "schemaPath": "#/properties/id/type",
        "params": {
          "type": "string"
        },
        "message": "should be string"
      }
    ]
  }
}
```

and without:

```json
{
  "statusCode": 400,
  "body": "Invalid input"
}
```

### Use Middy middlewares

`ApiGatewayContract` is compatible with middy. For example, if you wish to use Middy for Cors and logging:

```ts
import middy from '@middy/core';
import errorLogger from '@middy/error-logger';
import cors from '@middy/http-cors';
import { getHandler } from '@swarmion/serverless-contracts';
import { ajv } from 'libs/ajv';

const handler = getHandler(myContract, { ajv })(async event => {
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
myContract.outputSchemas;
```

in order to validate the input and/or the output of your lambda.

On the handler side, you can use the `getLambdaHandler` function on the contract to still infer the input and output types from the schema.

:::caution
The `getLambdaHandler` is only a pass-through adding typing capabilities, without any parsing nor validation.

This method is not recommended, use `getHandler` when possible.
:::

In order to safely use `getLambdaHandler`, you need to define a custom middleware than you can use to wrap your handler.
Here is an implementation example:

```ts title="src/libs/middlewares.ts"
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import jsonBodyParser from '@middy/http-json-body-parser';
import jsonValidator from '@middy/validator';
import type { Handler } from 'aws-lambda';
import { JSONSchema } from 'json-schema-to-ts';

interface Options {
  inputSchema?: JSONSchema;
  outputSchema?: JSONSchema;
}

export const applyHttpMiddlewares = <Event, Result>(
  handler: Handler<Event, Result>,
  { inputSchema, outputSchema }: Options,
): middy.MiddyfiedHandler<Event, Result> => {
  const middyfiedHandler = middy(handler);

  middyfiedHandler.use(jsonBodyParser());
  middyfiedHandler.use(jsonValidator({ inputSchema, outputSchema }));

  middyfiedHandler.use(httpErrorHandler());

  return middyfiedHandler;
};
```

```ts title="src/functions/myFeature/handler.ts"
import { getLambdaHandler } from '@swarmion/serverless-contracts';
import { applyHttpMiddlewares } from 'libs/middlewares';

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

### Generate mock event with the contract

With the `getMockHandlerInput` feature, you can quickly generate input events to test your lambda functions.
Using [json-schema-faker](https://github.com/json-schema-faker/json-schema-faker), it will generate random data based on the contract schemas and allow you overriding certain key with your own values.

```ts
import { getMockHandlerInput } from '@swarmion/serverless-contracts/test-utils';

const [mockEvent] = getMockHandlerInput(myContract, {
  pathParameters: { userId: '15' },
  queryStringParameters: { testId: 'plop', optional: undefined },
});
```

The result value for mockEvent will be something like

```ts
const mockEvent = {
  pathParameters: {
    userId: '15',
    pageNumber: '42', // Randomly generated
  },
  queryStringParameters: {
    testId: 'plop',
    optional: undefined, // Explicitly set undefined keys are kept as is
  },
  body: {
    foo: 'Banana split', // Randomly generated
  },
};
```

Then, you can use it directly in your test files:

```ts
import { getHandler } from '@swarmion/serverless-contracts';
import { getMockHandlerInput } from '@swarmion/serverless-contracts/test-utils';

import { ajv } from 'libs/ajv';

const handler = getHandler(myContract, { ajv })(async event => {
  // my handler...
});

const result = await handler(
  ...getMockHandlerInput(myContract, {
    pathParameters: { userId: '15' },
    queryStringParameters: { testId: 'plop' },
  }),
);

// Asserts on result
```

:::tip
You can use the [faker](https://fakerjs.dev/) keyword in your json schema properties definition to generate more precise random data in your inputs.

```ts
export const bodySchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      faker: 'name.firstName', // Will generate a random first name (e.g. 'John')
    },
    lastName: {
      type: 'string',
      faker: 'name.lastName', // Will generate a random last name (e.g. 'Doe')
    },
  },
  required: ['firstName', 'lastName'],
};
```

However, by default, faker keyword is not recognized by ajv. In order to use it, you should configure your ajv instance to recognize the `faker` keyword:

```ts
import Ajv from 'ajv';

export const ajvInstance = new Ajv({ keywords: ['faker'] });
```

:::

By default, we fixed the random generation seed used by `getMockHandlerInput`, so that test results are consistent.
This is different from the default behavior of `json-schema-faker` which uses a random seed.

If you need to change the seed, you can use the `setMockHandlerInputSeed` feature:

```ts
import {
  getMockHandlerInput,
  setMockHandlerInputSeed,
} from '@swarmion/serverless-contracts/test-utils';

setMockHandlerInputSeed('42'); // Will always generate the same random values

const [mockEvent1] = getMockHandlerInput(myContract);

const [mockEvent2] = getMockHandlerInput(myContract);

expect(mockEvent1).toEqual(mockEvent2); // Will always be true
```

### Generate OpenAPI documentation from the contracts

With the `getOpenApiDocument` feature, you can generate an OpenAPI documentation of your api from the contracts it provides to define its endpoints.

```ts
import { getOpenApiDocument } from '@swarmion/serverless-contracts';

const openApiDocumentation = getOpenApiDocumentation({
  title: 'Test API',
  description: 'API description',
  contracts: [getUserContract, postUserContract, deleteUserContract],
});
```

The resulting value will be an OpenAPI documentation of your endpoint in json format.
This is how it could look like once transformed into yaml (depending on the contracts you provide):

```yaml
openapi: 3.0.1
info:
  title: Test API
  description: API description
  version: '2023-02-24T17:09:48.113Z'
paths:
  /users/{userId}:
    get:
      responses:
        '200':
          description: 'Response: 200'
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                  name:
                    type: string
                required:
                  - id
                  - name
        '404':
          description: 'Response: 404'
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                required:
                  - message
      parameters:
        - name: userId
          in: path
          schema:
            type: string
          required: true
    delete:
      responses:
        '202':
          description: 'Response: 202'
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                required:
                  - message
        '404':
          description: 'Response: 404'
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                required:
                  - message
      parameters:
        - name: userId
          in: path
          schema:
            type: string
          required: true
  /users:
    post:
      responses:
        '201':
          description: 'Response: 201'
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                required:
                  - message
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: string
                name:
                  type: string
              required:
                - id
                - name
```

:::tip
If you use the [serverless-contracts-plugin](./5-serverless-plugin.md) for the Serverlesss framework, this feature is used by the `pnpm serverless generateOpenApiDocumentation` command with the contract that your service provides.
:::

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
