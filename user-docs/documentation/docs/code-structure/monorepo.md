---
sidebar_position: 1
---

# Monorepo

To leverage the decoupling capabilities of microservices while keeping the flexibility to rearrange your teams according to your needs, Swarmion is structured as a monorepo.

Therefore, it defines a set of _internal modules_ managed by [Nx](https://nx.dev/) and [Yarn workspaces](https://yarnpkg.com/features/workspaces).

## Types of internal modules

Swarmion defines two main types of _internal modules_.

### Services

Services are modules meant to be **deployed** and serve the application logic, provision the resources, etc. They can either be backend services or frontend services.

Although Swarmion mainly uses the [Serverless Framework](https://www.serverless.com/) to deploy its services, it is also possible to use other deployment providers.

### Libraries

Libraries are packaged modules. Their purpose is to be **built** (or **packaged**) and embedded into the code of a deployed service.

They are divided into two main types of libraries that only differ in their usage.

**Contracts** provide explicit type-safe interfaces between deployed services, that can be statically checked at compile time and and validated at runtime using JSONSchema. For more details on contracts, see the [contracts documentation](https://github.com/swarmion/swarmion/tree/main/packages/serverless-contracts).

**Packages** reduce code duplication between services by providing shared logic and configuration. These packages must not become too big in order for them to remain usable and must be well documented.

## The monorepo structure

Apart from the various configuration files at the root of the project, Swarmion philosophy is to keep a strict folder structure.

_Note: the services names in this folder are purely for the sake of the example and should not be considered standard._

```
.
├── backend
|   ├── core
|   |   ├── ...
|   |   ├── package.json            # dependencies of the core service
|   |   ├── serverless.ts           # core serverless service file
|   |   └── tsconfig.json           # core typescript config
|   |
|   ├── forum
|   |   ├── ...
|   |   ├── package.json            # dependencies of the forum service
|   |   ├── serverless.ts           # forum serverless service file
|   |   └── tsconfig.json           # forum typescript config
|   |
|   ├── users
|   |   ├── ...
|   |   ├── package.json            # dependencies of the users service
|   |   ├── serverless.ts           # users serverless service file
|   |   └── tsconfig.json           # users typescript config
|   |
|   └── ...                         # other deployed services
|
├── frontend
|   ├── app
|   |   ├── ...
|   |   ├── package.json            # dependencies of the app service
|   |   └── tsconfig.json           # app typescript config
|   |
|   ├── cloudfront
|   |   ├── ...
|   |   ├── package.json            # dependencies of the cloudfront service
|   |   ├── serverless.ts           # cloudfront serverless service file
|   |   └── tsconfig.json           # cloudfront typescript config
|   |
|   └── ...                         # other deployed services
|
├── commonConfiguration             # configuration files such as jest, babel...
|   ├── babel.config.js
|   └── lintstaged-base-config.js
|
├── contracts                       # JSONSchema-based binding contracts.
|   ├── core-contracts
|   |   ├── ...
|   |   ├── package.json
|   |   └── tsconfig.json
|   |
|   ├── forum-contracts
|   |   ├── ...
|   |   ├── package.json
|   |   └── tsconfig.json
|   |
|   ├── users-contracts
|   |   ├── ...
|   |   ├── package.json
|   |   └── tsconfig.json
|   |
|   └── ...                         # other contracts, used between deployed services
|
├── packages
|   ├── configuration    # common constants used in all services
|   |   ├── ...
|   |   ├── package.json
|   |   └── tsconfig.json
|   |
|   ├── serverless-configuration    # common constants used in all serverless deployed services
|   |   ├── ...
|   |   ├── package.json
|   |   └── tsconfig.json
|   |
|   ├── serverless-helpers          # a set of shared helpers
|   |   ├── ...
|   |   ├── package.json
|   |   └── tsconfig.json
|   |
|   └── ...                        # other internal shared packages
|
├── package.json                   # shared dependencies and global scripts
└── yarn.lock                      # unique lock file, using yarn workspaces

```

## Nx and Yarn workspaces

These tools work in sync but provide slightly different features.

Nx:

- Filter changes, run commands

Yarn workspaces:

- Handle dependencies anywhere in the repository

You can find [here](https://nx.dev/getting-started/nx-core) a good explanation on how and why use these tools together.
