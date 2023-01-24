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

- install pnpm `npm install -g pnpm`
- rename all your `yarn` commands to `pnpm`:
  - `yarn` -> `pnpm install`
  - `yarn test` -> `pnpm test`
  - `yarn package` -> `pnpm package`
  - `yarn deploy` -> `pnpm run deploy`
- replace all occurrences of `yarn.lock` with `pnpm-lock.yaml` (search, prettier, etc.)
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
