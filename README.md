# Swarmion

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors-) [![Downloads](https://img.shields.io/npm/dw/@swarmion/serverless-contracts?style=flat-square)](https://www.npmjs.com/package/@swarmion/serverless-contracts)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

A set of tools to build and deploy type-safe microservices. In order to see a working example of these tools, check out [Swarmion template](https://github.com/swarmion/template).

This project is composed of the following packages:

- [@swarmion/serverless-contracts](./packages/serverless-contracts): generate and use type-safe contracts in your Serverless microservices ([view on npm](https://www.npmjs.com/package/@swarmion/serverless-contracts))
- [@swarmion/serverless-plugin](./packages/serverless-contracts-plugin): a Serverless plugin to safely deploy microservices ([view on npm](https://www.npmjs.com/package/@swarmion/serverless-plugin))
- [@swarmion/eslint-plugin](./packages/eslint-plugin): an eslint plugin with rules to enforces proper usage of contracts ([view on npm](https://www.npmjs.com/package/@swarmion/eslint-plugin))

## Motivation

When splitting a codebase into multiple services, all services need to be able to deploy independently. However, how to ensure that each deployment will not impact the behavior of other services?

The proposed solution is to constrain every service to interact with other services through a system of contracts.

Each interaction between services is inherently asymmetric:

- The **provider** is responsible for giving resources to other services
- The **consumers** use resources given by the provider

Each service can be both a provider and a consumer for different contracts.

In order to make these contracts safe, each side of the contract must be able to validate it:

- statically with Typescript
- dynamically with JSONSchema

## Defining contracts between services

Serverless contracts are based on the idea of defining contracts before implementing them.

See [@swarmion/serverless-contracts](./packages/serverless-contracts) for more details on how to define and use contracts in your services.

## Securing the deploy process

Serverless contracts enable validation at deploy time in order to prevent breaking changes to be deployed in production. See [@swarmion/serverless-plugin](./packages/serverless-contracts-plugin) for more details on the available configuration and commands.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/fargito"><img src="https://avatars.githubusercontent.com/u/29537204?v=4?s=100" width="100px;" alt=""/><br /><sub><b>François Farge</b></sub></a><br /><a href="https://github.com/swarmion/swarmion/commits?author=fargito" title="Code">💻</a> <a href="#ideas-fargito" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/swarmion/swarmion/commits?author=fargito" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/adriencaccia"><img src="https://avatars.githubusercontent.com/u/19605940?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Adrien Cacciaguerra</b></sub></a><br /><a href="https://github.com/swarmion/swarmion/commits?author=adriencaccia" title="Code">💻</a> <a href="#ideas-adriencaccia" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/MaximeVivier"><img src="https://avatars.githubusercontent.com/u/55386175?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Maxime Vivier</b></sub></a><br /><a href="https://github.com/swarmion/swarmion/commits?author=MaximeVivier" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/GuillaumeLagrange"><img src="https://avatars.githubusercontent.com/u/19265358?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Guillaume Lagrange</b></sub></a><br /><a href="https://github.com/swarmion/swarmion/commits?author=GuillaumeLagrange" title="Code">💻</a> <a href="https://github.com/swarmion/swarmion/commits?author=GuillaumeLagrange" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/Sc0ra"><img src="https://avatars.githubusercontent.com/u/25872509?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Axel Fournier</b></sub></a><br /><a href="https://github.com/swarmion/swarmion/commits?author=Sc0ra" title="Code">💻</a> <a href="https://github.com/swarmion/swarmion/commits?author=Sc0ra" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
