# @serverless-contracts/plugin

A plugin to safely deploy Serverless microservices.

This plugin is part of the [serverless-contracts](https://github.com/fargito/serverless-contracts) project. See its documentation for more insights.

## Installation

```bash
npm install @serverless-contracts/plugin --save-dev
```

Or if you're using yarn

```bash
yarn add -D @serverless-contracts/plugin
```

Then in your `serverless.ts` file, add `@serverless-contracts/plugin` to the list of your plugins.

## Configuration

Add a `contracts` key to your Serverless file:

```ts

import { myFirstContract, mySecondContract } from 'my-contracts-package';
import { consumedContract } from 'other-contracts';

const serverlessConfigation = {
    service: 'my-app',
    provider: {
        name: aws
    },
    plugins: ['@serverless-contracts/plugin'],
    functions: {
        ...
    },
    contracts: {
        provides: {
            myFirstContract: myFirstContract.fullContractSchema,
            mySecondContract: mySecondContract.fullContractSchema
        },
        consumes: {
            consumedContract: consumedContract.fullContractSchema,
        },
    },
}
```

Where all the contracts are defined using [serverless-contracts](https://github.com/fargito/serverless-contracts).

## Commands

- `serverless localContracts`: prints the local version of the contracts
- `serverless remoteContracts`: prints the currently deployed version of the contracts
- `serverless safeDeploy --strategy <strategy>`: a wrapper around the `deploy` command of the Serverless Framework, check if the contracts modification is deployable with the chosen strategy. Choices are `PROVIDER_FIRST` or `CONSUMER_FIRST`

## Typing

This plugin exposes its own types. In order to properly type your Serverless service file:

```ts
import { ServerlessContracts } from '@serverless-contracts/plugin';
import { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS & ServerlessContracts = {
    ...
}
```
