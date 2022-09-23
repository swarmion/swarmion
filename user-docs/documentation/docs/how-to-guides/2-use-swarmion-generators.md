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

At the root of your project, run `pnpm nx generate @swarmion/nx-plugin:service myService`. This will create a simple service in the repository's structure respecting our guidelines.

## Generate new Libraries

At the root of the project, run `pnpm nx generate @swarmion/nx-plugin:library myLibrary`. This will create a simple internal library in the repository's structure respecting our guidelines.

## Custom folder structure

You can add to your command the `--directory` option to specify the path where you want to generate your new package.

To build the following repo architecture,

```
├── backend/
|   ├── services/
|   |   ├── core/                       # core service
|   |   ├── forum/                      # forum service
|   |   ├── users/                      # users service
|   |   └── ...                         # other deployed services
|
```

simply execute

```bash
pnpm nx generate @swarmion/nx-plugin:service core --directory=backend/services
pnpm nx generate @swarmion/nx-plugin:service forum --directory=backend/services
pnpm nx generate @swarmion/nx-plugin:service users --directory=backend/services
```
