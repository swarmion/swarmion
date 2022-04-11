---
sidebar_position: 5
---

# Nx Plugin

Generate new packages respecting the [monorepo code structure](./monorepo#the-monorepo-structure) in one command

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
