---
sidebar_position: 1
---

# Generate your first Swarmion project

In this guide we'll see how to generate a Swarmion project from scratch.

:::info
If you're looking how to migrate your existing project to Swarmion, please check out [the migration docs](../how-to-guides/migration-guide).
:::

## Requirements

- nvm: [install docs](https://github.com/nvm-sh/nvm#installing-and-updating)
- yarn: [install docs](https://yarnpkg.com/getting-started/install)
- AWS CLI: [install docs](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)

Before generating your project, run in a terminal:

```bash
node -v
```

You should get `v16.xx.xx`. If this is not the case, run `nvm use 16`.

## Create a new project from the Swarmion template

Run the following command:

```bash
yarn create swarmion-app
```

You will be prompted with the question "What is your project named?", simply enter your project name and hit _enter_.
The following will happen:

- A new folder with your project name in the current directory
- It will be populated with the Swarmion template
- `yarn install` will be run inside the project to install all the dependencies
- The libraries of the project will be packaged
- A git repository will be initialized

:::tip
You can add an argument to the `create swarmion-app` command to skip the prompt and instantly generate your project:

```bash
yarn create swarmion-app my-project-name
```

:::

## Open the project in your editor

Swarmion projects are designed to work best when used with [VS Code](https://code.visualstudio.com/).

:::info
You can read more about VS Code integration in Swarmion in the dedicated page: [VS Code support](../why-swarmion/swarmion-tools/vscode).
:::

You can now open the project by running:

```bash
code my-project-name/my-project-name.code-workspace
```

:::caution
Be sure to always open the project using the [multi-root workspace](https://code.visualstudio.com/docs/editor/multi-root-workspaces) feature.
Otherwise, you will not benefit from linting, proper autocompletion, testing, and other features.

Never open the project by running simply:

```bash
code my-project-name
```

:::

## Overview of the generated project

In the _Explorer_ tab, you should see the following workspaces:

- `my-project-name root`: the root folder of your project. It contains all the other workspaces, but you will never open any code file inside this one. It will allow you to access all root level configuration files.
- `backend core [service]`: the folder containing the backend core service.
- `configuration [library]`: the folder containing the configuration library.
- `serverless configuration [library]`: the folder containing the serverless configuration library.
- `contracts core [library]`: the folder containing the contracts library for the core service.

A **Service** represent a backend serverless service using the [Serverless framework](https://serverless.com/framework/). When the command `yarn deploy` is run inside, it will deploy a stack to AWS.

A **Library** represent a set of reusable code that can be used by multiple services or other libraries. It cannot be deployed, since it is only containing code.

---

The project is organized in a monorepo containing four packages (one service and three libraries):

![dependency graph](../../static/screenshots/basic-swarmion-app-graph.png)

Here you can see that the `backend-core` service has the `configuration`, `core-contract` and `serverless-configuration` libraries as dependencies.

## Scripts

At the root level, the following scripts are available:

- `nvm use`: use the version of node set in `.nvmrc`
- `yarn`: install npm dependencies in all packages
- `yarn nx graph`: start an app to visualize dependencies in your monorepo (see more: [Nx graph](https://nx.dev/nx/dep-graph#graph))
- `yarn package`: compile the libraries
- `yarn test`: run tests in all the services and libraries
- `yarn upgrade-interactive` in order to bump all dependencies to their latest version. Be careful as it may introduce breaking changes
