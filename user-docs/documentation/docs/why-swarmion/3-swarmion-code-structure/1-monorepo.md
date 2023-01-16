---
sidebar_position: 1
---

# Monorepo

To leverage the decoupling capabilities of microservices while keeping the flexibility to rearrange your teams according to your needs, Swarmion is structured as a monorepo.

Therefore, it defines a set of _internal modules_ managed by [Nx](https://nx.dev/) and [pnpm workspaces](https://pnpm.io/workspaces).

## Types of internal modules

Swarmion defines two main types of _internal modules_.

### Services

Services are modules meant to be **deployed** and serve the application logic, provision the resources, etc. They can either be backend services or frontend services.

For more information, check out [the services documentation](./services).

### Libraries

Libraries are packaged modules. Their purpose is to be **built** (or **packaged**) and embedded into the code of a deployed service.

They are divided into two main types of libraries that only differ in their usage.

**Contracts** provide explicit type-safe interfaces between deployed services, that can be statically checked at compile time and and validated at runtime using JSONSchema. For more details on contracts, see the [contracts documentation](../serverless-contracts/concepts).

**Packages** reduce code duplication between services by providing shared logic and configuration. These packages must not become too big in order for them to remain usable and must be well documented.

For more information, check out [the libraries documentation](./libraries).

## The monorepo structure

Apart from the various configuration files at the root of the project, Swarmion philosophy is to keep a strict folder structure.

You should define your own arborescence and keep the same logic for all your teams.

:::note
The services names in this folder are purely for the sake of the example and should not be considered standard.
:::

```
├── backend/
|   ├── core/                       # core service
|   ├── users/                      # users service
|   └── ...                         # other deployed services
|
├── frontend/
|   ├── app/
|   ├── cloudfront/
|   └── ...                         # other deployed services
|
├── commonConfiguration/            # configuration files such as dependency-cruiser...
|   └── dependency-cruiser.config.js
|
├── contracts/                      # JSONSchema-based binding contracts.
|   ├── core-contracts/
|   ├── users-contracts/
|   └── ...                         # other contracts, used between deployed services
|
├── packages/
|   ├── serverless-configuration/   # common constants used in all serverless deployed services
|   ├── serverless-helpers/         # a set of shared helpers
|   └── ...                         # other internal shared packages
|
├── package.json                   # shared dependencies and global scripts
└── pnpm-lock.yaml                 # unique lock file, using pnpm workspaces

```

## Nx and pnpm workspaces

These tools work in sync but provide slightly different features.

Nx:

- Filter changes, run commands

pnpm workspaces:

- Handle dependencies anywhere in the repository

You can find [here](https://nx.dev/getting-started/nx-core) a good explanation on how and why use these tools together.
