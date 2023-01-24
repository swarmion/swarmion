---
sidebar_position: 1
---

# From Yarn to Pnpm

[Yarn](https://yarnpkg.com/) and [Pnpm](https://pnpm.io/) are both package managers.

## Why?

In order to choose between these two alternatives, we have checked the following criteria:

- popularity: this is the package manager that is used by all the major frameworks (NextJS, VueJS, Vite, etc.)
- performance : pnpm uses hardlinks for `node_modules` by default, so you won't end up with 100GB of `node_modules` across the projects on your machine. This also makes performance way better for installation, update, etc.
- stability: the way pnpm handles workspaces (monorepo) and `node_modules` in each package is much better than yarn: you have a node_modules folder in all your packages, rather than everything in the root. The impact is that if you have a dependency that does something crazy (like Serverless that dynamically requires modules), it will work

## How?

Migrating from yarn to pnpm is quite straightforward:

- install pnpm `npm install -g pnpm`
- rename all your `yarn` commands to `pnpm`:
  - `yarn` -> `pnpm install`
  - `yarn test` -> `pnpm test`
  - `yarn package` -> `pnpm package`
  - `yarn deploy` -> `pnpm run deploy` (**run** is required here, as `pnpm deploy` is a reserved command)
- replace all occurrences of the string `yarn.lock` in your source files with `pnpm-lock.yaml` (search, prettier, etc.)
- in your CI/CD, when using `actions/setup-node@v3`, set `cache` to `'pnpm'`
- if you're using yarn PnP, remove `.yarnrc.yml` and the `.yarn` folder
- in the root `package.json` set the `packageManager` key to `pnpm@<version>` (replace `<version>` with the latest available version)
- create a `pnpm-workspace.yaml` file with:

  ```yaml
  packages:
    - 'services/*'
    - 'contracts/*'
    - 'packages/*'
  ```

  and everything that is in the `workspaces` key of the root `package.json`

- run `pnpm import` to generate a `pnpm-lock.yaml` from your `yarn.lock`, then remove `yarn.lock`
- run `pnpm install`

## Troubleshooting

Pnpm is more strict than Yarn when dealing with dependencies. This is a good thing, because it makes package configurations self-sufficient.

However, migrating from yarn to pnpm, you may find that you miss some dependencies in your packages for this reason. In this case:

- add the missing types packages for obvious ones
- dig into dependencies to find out source issues in less obvious ones

Most often it should be an issue with peer dependencies that are not properly satisfied.
