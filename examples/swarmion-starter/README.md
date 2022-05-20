# Serverless Monorepo Microservices Template

This template aims to define an opinionated clean Serverless monorepo microservices architecture.

<p align="right">
  <i>If you use this repo, star it ✨</i>
</p>

## Install

Head to [the install docs](./docs/install.md)!

If you need to setup your CI/CD: [docs](./docs/ci-cd.md).

## Features

- Nx
- Eslint configuration
- Prettier configuration
- Jest configuration
- Typescript
- Common packages built with babel, with a watch mode
- Selective tests, package and deploy to remove the need to run all the tests and deploy at every commit.

## Code principles

This repository follows the code principles:

- **Your codebase should adapt to your team organizations**
- **DRY** (Don't Repeat Yourself)
- **Don't deploy all at once**
- **Safe deployments**

In order to respect these guidelines, a good solution is the Monorepo approach. See:

- [the Monorepo structure documentation](./docs/monorepo-structure.md)
- [the contracts documentation](https://github.com/swarmion/swarmion)

Tips:

- Always explicitly declare dependencies between end services in `package.json`
- These dependencies can be of two kinds:
  - code dependencies: _service B_ declares _service A_ as a dependency because it needs some code exported by _service A_;
  - deploy dependencies: _service B_ declares _service A_ as a dependency because it needs _service A_ to be deployed before it.

## Commands

These commands have to be run at the root of the project.

- `nvm use`: set the version of node set in `.nvmrc`
- `yarn`: install node dependencies in all packages;
- `yarn package`: compile the common packages;
- `yarn watch`: launch the compilation of all packages in watch mode;
- `yarn deploy`: deploy all the end services in order;
- `yarn test-circular`: check if there are circular dependencies in the code base;
- `yarn generate-service`: generate a new service;
- `yarn generate-library`: generate a new library;

## Adding a new service

- Good idea!

## Other docs

- [Swarmion](https://github.com/swarmion/swarmion)
