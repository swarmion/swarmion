---
sidebar_position: 3
---

# Pass additional arguments to Lambda handlers

A powerful feature of Serverless contracts is its ability to provide type-safe additional arguments to your lambda handler.

## Why use additional arguments?

Lambda handlers typically interact with quite a lot of AWS services. This can be:

- to read information (ex: from DynamoDB or SSM Parameter Store)
- to write information (ex: to DynamoDB)

In any case, all the interactions that the Lambda has with other services can be considered as **side-effects**, meaning that they directly influence the Lambda's behavior. This makes the Lambda code quite hard to structure and test as it grows.

In fact, each side-effect make our Lambda code "impure" in terms of functional programing. A possible solution is to pass all the side-effects as arguments to our handler code. However, this is not natively possible on Lambda.

Serverless contracts natively embrace this idea and provide a simple way to make your lambda code pure again!

## How to use additional arguments?

### Define the handler with additional arguments

All Swarmion "runtime" contracts (such as `ApiGatewayContract` and `EventBridgeContract`) are compatible with the additional arguments feature. Let's take an example with `ApiGatewayContract`.

Let's imagine that we want to pass it a sideEffect called `getUser` with type `(userId: string) => Promise<User>`. We could pass it to our Lambda

```ts
// handler.ts
import { getHandler, StatusCodes } from '@swarmion/serverless-contracts';
import { getUser } from 'path/to/getUser';

const sideEffects = {
  getUser, // (userId: string) => Promise<User>
};

const main = getHandler(myContract)(
  (
    event,
    _context, // will always be passed by Lambda
    _callback, // will always be passed by Lambda
    { getUser }: typeof sideEffects = sideEffects,
  ) => {
    const user = await getUser('toto'); // type-safe!

    const { name, id } = user; // type-safe!

    return { statusCode: StatusCodes.OK, body: { name, id } };
  },
);
```

There's quite a lot going on here, let's dive into it:

- ⚠️ you need to explicitly provide Typescript with the type of our additional argument (`typeof sideEffects`). Otherwise it would be `never`!
- ⚠️ you need to explicitly pass a default value to the additional argument (with `= sideEffect`). Otherwise, it will be undefined at runtime!
- ⚠️ you need to take into account the `context` and `callback` arguments that will be passed to you handler at runtime by Lambda even if you don't use them!

### Override the additional arguments in tests

Here is the real treat with this pattern: it become super easy to test you lambda behavior and abstract away the side-effects complexity.

Let's say you want to ensure that your lambda returns the `name` and `id` of the returned user, you could write a handler test:

```ts
// handler.test.ts
import { main } from './handler';

const mockEvent = {
  // ...
};

const mockGetUser = vitest.fn(() => ({
  statusCode: StatusCodes.OK,
  body: { name, id },
}));

const result = await main(
  mockEvent,
  mockContext, // fake context
  () => null, // fake callback
  { getUser: mockGetUser }, // type-safe!
);

expect(result).toEqual({
  statusCode: StatusCodes.OK,
  body: { name: 'Toto', id: 'toto' },
});
expect(mockGetUser).toHaveBeenCalledOnce();
expect(mockGetUser).toHaveBeenCalledWith('toto');
```

The call to `main` here is type-safe, which means that if you change the `sideEffects` in the handler definition, Typescript will enforce updating of the related tests.

This example shows that you can test the logic of the handler without worrying about the underlying implementation of the `getUser` function!
