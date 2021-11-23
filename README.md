# Serverless contracts

A set of tools to build and deploy type-safe Serverless microservices.

## Motivation

When splitting your codebase into multiple services, you need to be able to deploy each service independently. However, how to ensure that each deployment will not impact the behavior of other services?

The proposed solution is to constrain every service to interact with other services through a system of contracts.

Each interaction is inherently asymmetric:

- The **provider** is reponsible for giving resources to other services
- The **consumers** use resources given by the provider

Each service can be both a provider and a consumer for different contracts, but each contract is only provided by a single service.

In order to make these contracts safe, each side of the contract must be able to validate it:

- statically with Typescript
- dynamically with JSONSchema

_As of today, only interactions through ApiGateway's HTTP API and REST API are supported. In the future, CloudFormation import/exports and more will also be supported._

## Defining contracts between services

Serverless contracts are based on the idea of defining contracts before implementing them.

See [@serverless-contracts/core](./packages/serverless-contracts/README.md) for more details on how to define and use contracts in your services.

## Securing the deployment of your services

Serverless contracts enable validation of your deployments in order to prevent breaking changes to be deployed in production. See [@serverless-contracts/plugin](./packages/serverless-contracts-plugin/README.md) for more details on the available configuration and commands.
