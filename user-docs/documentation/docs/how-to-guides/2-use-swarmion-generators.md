---
sidebar_position: 2
---

# Use Swarmion generators

Generate new packages respecting the [monorepo code structure](../why-swarmion/swarmion-code-structure/monorepo#the-monorepo-structure) in one command.

## Installation

```bash
# using pnpm
pnpm add --save-dev @swarmion/nx-plugin

# using yarn
yarn add --save-dev @swarmion/nx-plugin

# using npm
npm install --save-dev @swarmion/nx-plugin
```

## Generate new Services

At the root of your project, run:

```bash
pnpm nx generate @swarmion/nx-plugin:service my-service
```

This will create a simple service in the repository's structure respecting our guidelines.

By default, new packages will be placed in the `packages` directory. You can customize this with the `--directory` option. For example:

```bash
pnpm nx generate @swarmion/nx-plugin:service myService --directory=path/to/packages
```

## Generate new Libraries

At the root of the project, run:

```bash
pnpm nx generate @swarmion/nx-plugin:library my-library
```

This will create a simple internal library in the repository's structure respecting our guidelines.

By default, new services will be placed in the `services` directory. You can customize this with the `--directory` option. For example:

```bash
pnpm nx generate @swarmion/nx-plugin:service my-service --directory=path/to/services
```
