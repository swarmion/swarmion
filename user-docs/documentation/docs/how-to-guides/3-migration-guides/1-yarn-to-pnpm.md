---
sidebar_position: 1
---

# From Yarn to Pnpm

[Yarn](https://yarnpkg.com/) and [Pnpm](https://pnpm.io/) are both package managers.

## Why?

In order to choose between these two alternatives, we have checked the following criteria:

- built-in-support for monorepos: both package managers include this with workspaces
- performance: pnpm reuses most of its package versions from its cache and symlinks them in our packages, which makes installs significantly faster
- stability: by symlinking dependencies inside packages, pnpm better handles mismatches between package versions among our packages

## How?

Migrating from yarn to pnpm is quite straightforward:

- rename all your `yarn` commands to `pnpm`:
  - `yarn` -> `pnpm install`
  - `yarn test` -> `pnpm test`
  - `yarn package` -> `pnpm package`
  - `yarn deploy` -> `pnpm run deploy`
- remove `yarn.lock`
- if you're using yarn PnP, remove `.yarnrc.yml` and the `.yarn` folder
- in the root `package.json` set the `packageManager` key to `pnpm@<version>` (replace `<version>` with the latest available version)
- exclude `pnpm-lock.yaml` from search, from prettier, etc.
- run `pnpm install`
