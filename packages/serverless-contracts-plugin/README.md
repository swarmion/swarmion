# @swarmion/serverless-plugin

A plugin to safely deploy Serverless microservices.

This plugin is part of the [Swarmion](https://www.swarmion.dev) project. See its documentation for more insights.

## Installation

```bash
npm install @swarmion/serverless-plugin --save-dev
```

Or if you're using yarn

```bash
yarn add -D @swarmion/serverless-plugin
```

Then in your `serverless.ts` file, add `@swarmion/serverless-plugin` to the list of your plugins.

## Configuration

Add a `contracts` key to your Serverless file:

```ts

import { myFirstContract, mySecondContract } from 'my-contracts-package';
import { consumedContract } from 'other-contracts';

const serverlessConfiguration = {
    service: 'my-app',
    provider: {
        name: aws
    },
    plugins: ['@swarmion/serverless-plugin'],
    functions: {
        ...
    },
    contracts: {
        provides: {
            myFirstContract,
            mySecondContract,
        },
        consumes: {
            consumedContract,
        },
    },
}
```

Where all the contracts are defined using [serverless-contracts](https://www.swarmion.dev).

## Commands

- `serverless localContracts`: prints the local version of the contracts
- `serverless remoteContracts`: prints the currently deployed version of the contracts
- `serverless safeDeploy --strategy <strategy>`: a wrapper around the `deploy` command of the Serverless Framework, check if the contracts modification is deployable with the chosen strategy. Choices are `PROVIDER_FIRST` or `CONSUMER_FIRST`

## Typing

This plugin exposes its own types. In order to properly type your Serverless service file:

```ts
import { ServerlessContracts } from '@swarmion/serverless-plugin';
import { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS & ServerlessContracts = {
    ...
}
```
