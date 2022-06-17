---
sidebar_position: 1
---

# Swarmion Intro

Let's discover **Swarmion**.

## What is Swarmion?

Swarmion is an open-source Framework for building Type-safe Serverless microservices at scale. It takes full advantage of the **Serverless Framework** to handle deployment and provisioning of resources, while adding support for microservices and end-to-end type-safety.

## Our core beliefs

### Your codebase should adapt to your team organization

Changes in the way you organize your teams should not have an impact on the speed at which you can develop and deploy new features. Therefore, Swarmion uses a flexible microservices approach in a monorepo.

### DRY (Don't Repeat Yourself)

Having several teams working in the same environment requires efficient collaboration. Swarmion allows to clearly separate the shared logic and interfaces from the service-specific logic for better decoupling.

### Developer experience is key for code quality

As your codebase grows, testing and deployment times are likely to skyrocket. Swarmion uses optimized low-level software (esbuild, vitejs) to reduce testing and building times and a smart monorepo management tool ([Nx](https://nx.dev)) to provide a top-level developer experience and reduce CI/CD delays.

### Trust your deployments (beta)

As the number of moving parts in your organization increases, it is paramount to secure the deployment process. At each deployment, Swarmion validates requested changes against all impacted services to prevent breaking changes.

## Main features

- Yarn 3 with workspaces
- Nx
- Eslint configuration
- Prettier configuration
- Jest configuration
- End-to-end Typescript
- Shared Typescript libraries built with babel, with a watch mode
- Selective tests, package and deploy to remove the need to run all the tests and deploy at every commit.
- Create a new Swarmion project through CLI
- Generate new backend services through CLI
- Generate new packaged internal library through CLI
