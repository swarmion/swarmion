---
sidebar_position: 2
---

# Use Swarmion generators

Generate new packages respecting the [monorepo code structure](./monorepo#the-monorepo-structure) in one command.

## Installation

```bash
yarn add -D @swarmion/nx-plugin
```

or if using npm

```bash
npm install @swarmion/nx-plugin --save-dev
```

## Generate new Services

At the root of your project, run `yarn nx generate @swarmion/nx-plugin:service myService`. This will create a simple service in the repository's structure respecting our guidelines.

## Generate new Libraries

At the root of the project, run `yarn nx generate @swarmion/nx-plugin:library myLibrary`. This will create a simple internal library in the repository's structure respecting our guidelines.

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
yarn nx generate @swarmion/nx-plugin:service core --directory=backend/services
yarn nx generate @swarmion/nx-plugin:service forum --directory=backend/services
yarn nx generate @swarmion/nx-plugin:service users --directory=backend/services
```
