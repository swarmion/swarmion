---
sidebar_position: 5
---

# `AJV` dependency injection in `getHandler` feature

## Why?

Before version 0.27.0, for runtime validation purposes, the `getHandler` feature used an AJV instance created in the serverless-contracts package.
However, some users reported that they needed to customize the AJV instance used for validation, for example to add custom keywords.
Thus, we decided to add an `ajv` key to the `getHandler` signature to allow that and remove the default AJV instance, which introduced a breaking change.

For more context, check out:

- [the release notes](https://github.com/swarmion/swarmion/releases/tag/v0.27.0)
- [the migration PR](https://github.com/swarmion/swarmion/pull/612)

## How?

Migrating from the default AJV instance to a custom one is quite straightforward:

1. Upgrade `@swarmion/serverless-contracts` to version `0.26.0` or higher
2. In your backend services handlers defined with the `getHandler` feature, update the signature of your implementation to provide an AJV instance:

```diff
+ import { AJV } from 'ajv';
+ const ajv = new AJV(); // or any other AJV instance you want to use

- const handler = getHandler(contract)(async (event) => {
+ const handler = getHandler(contract, { ajv })(async (event) => {
});
```

## Share a singleton AJV instance across the whole project

In order to reduce code duplication, we recommend creating a singleton AJV instance and share it across the whole project.

Here is an example of how to do it:

```ts title="libs/ajv.ts"
import Ajv from 'ajv';

export const ajv = new Ajv();

// or if using json-schema-faker

export const ajv = new Ajv({ keywords: ['faker'] });
```

```ts title="functions/myFunction/handler.ts"
import { getHandler } from '@swarmion/serverless-contracts';

import { myContract } from '@my-swarmion-app/contracts';

import { ajv } from 'libs/ajv';

export const handler = getHandler(myContract, { ajv })(async event => {
  // ...
});
```
