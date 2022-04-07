---
sidebar_position: 1
---

# Contracts Concepts

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
