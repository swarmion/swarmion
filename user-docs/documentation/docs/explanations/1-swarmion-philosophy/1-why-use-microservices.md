---
sidebar_position: 1
---

# Why use a microservices approach?

_**Disclaimer**: this documentation is a work in progress. Feel free to [open an issue on Swarmion](https://github.com/swarmion/swarmion/issues)_

Swarmion is primarily a microservices framework. When building Serverless applications, relying on the traditional monolithic approach becomes limited.

## What is a monolith?

A Monolith is the traditional way of building and deploying web applications. The principle is to put all the code and business logic in a single deployment unit. It can be deployed in many different ways, but all the code needs to be shipped at once.

Its main advantages are:

- the deployment unit: there can only be one live version of the code
- the easy start: many existing frameworks

While this is a completely valid approach, it has some drawbacks that can make it impractical as the codebase grows and so does the number of people involved.

### Using a monolithic approach in Serverless applications

There are mainly two way to have a monolithic approach for Serverless applications:

- the mono-lambda approach: using a single function to deploy all your business logic
- the mono-stack approach: provisioning all the resources and business logic of your application in a single stack (mono-stack approach)

### Know issues with monoliths in Serverless applications

The main drawbacks in :

- it can become hard to maintain the codebase coherence as it grows
- processes cannot scale as the codebase grows
  - all parts of the code need to be run at every change, even th
  - Hard limits: it is not possible to provision an unlimited number of resources at the same time. AWS CloudFormation, for example, has [a hard limit of 500 resources per stack](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cloudformation-limits.html). It may seem a lot but it means that ignoring this constraint may mean a costly refactoring in the future.

## What are microservices?

In order to tackle the monolith drawbacks, the microservices approach introduces many deployment units, each one containing a small part of our application code.

## References

- Building microservices, _Sam Newman_
