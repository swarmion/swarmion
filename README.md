# Serverless contracts

A set of tools to build and deploy type-safe Serverless microservices.

This projet is composed of the following packages:

- [@serverless-contracts/core](./packages/serverless-contracts): generate and use type-safe contracts in your microservices
- [@serverless-contracts/plugin](./packages/serverless-contracts-plugin): a Serverless plugin to safely deploy microservices

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
