# Serverless contracts
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

A set of tools to build and deploy type-safe Serverless microservices.

This projet is composed of the following packages:

- [@serverless-contracts/core](./packages/serverless-contracts): generate and use type-safe contracts in your microservices
- [@serverless-contracts/plugin](./packages/serverless-contracts-plugin): a Serverless plugin to safely deploy microservices
- [@serverless-contracts/eslint-plugin](./packages/serverless-contracts-plugin): an eslint plugin with rules to enforces proper usage of contracts

## Motivation

When splitting a codebase into multiple services, all services need to be able to deploy independently. However, how to ensure that each deployment will not impact the behavior of other services?

The proposed solution is to constrain every service to interact with other services through a system of contracts.

Each interaction between services is inherently asymmetric:

- The **provider** is reponsible for giving resources to other services
- The **consumers** use resources given by the provider

Each service can be both a provider and a consumer for different contracts, but each contract is only provided by a single service.

In order to make these contracts safe, each side of the contract must be able to validate it:

- statically with Typescript
- dynamically with JSONSchema

## Defining contracts between services

Serverless contracts are based on the idea of defining contracts before implementing them.

See [@serverless-contracts/core](./packages/serverless-contracts) for more details on how to define and use contracts in your services.

## Securing the deploy process

Serverless contracts enable validation at deploy time in order to prevent breaking changes to be deployed in production. See [@serverless-contracts/plugin](./packages/serverless-contracts-plugin) for more details on the available configuration and commands.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/fargito"><img src="https://avatars.githubusercontent.com/u/29537204?v=4?s=100" width="100px;" alt=""/><br /><sub><b>François Farge</b></sub></a><br /><a href="https://github.com/fargito/serverless-contracts/commits?author=fargito" title="Code">💻</a> <a href="#ideas-fargito" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/fargito/serverless-contracts/commits?author=fargito" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/adriencaccia"><img src="https://avatars.githubusercontent.com/u/19605940?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Adrien Cacciaguerra</b></sub></a><br /><a href="https://github.com/fargito/serverless-contracts/commits?author=adriencaccia" title="Code">💻</a> <a href="#ideas-adriencaccia" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!