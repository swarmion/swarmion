# Swarmion Contributing Guide

Hi! We are really excited that you are interested in contributing to Swarmion. Before submitting your contribution, please make sure to take a moment and read through the following guide:

## Repo Setup

The Swarmion repo is a monorepo using pnpm workspaces. The package manager used to install and link dependencies must be [pnpm](https://pnpm.io/).

We recommend installing [ni](https://github.com/antfu/ni) to help switching between repos using different package managers. `ni` also provides the handy `nr` command which running npm scripts easier:

- `ni` is equivalent to `pnpm install`
- `nr test` is equivalent to `pnpm run test`

To develop and test `swarmion` package:

1. Run `pnpm install` in `swarmion`'s root folder

2. Run `pnpm run package` to build sources

3. Run `pnpm run test` to all the tests and lint checks

## Debugging

### VS Code

If you want to use break point and explore code execution you can use the ["Run and debug"](https://code.visualstudio.com/docs/editor/debugging) feature from vscode.

1. Add a `debugger` statement where you want to stop the code execution.

2. Click on the "Run and Debug" icon in the activity bar of the editor.

3. Click on the "Javascript Debug Terminal" button.

4. It will open a terminal, then type the test command: `pnpm run test`

5. The execution will stop and you'll use the [Debug toolbar](https://code.visualstudio.com/docs/editor/debugging#_debug-actions) to continue, step over, restart the process...

## Testing Swarmion against external packages

You may wish to test your locally-modified copy of Swarmion packages against another package that is using it. For pnpm, after building Swarmion, you can use [`pnpm.overrides`](https://pnpm.io/package_json#pnpmoverrides). Please note that `pnpm.overrides` must be specified in the root `package.json` and you must first list the package as a dependency in the root `package.json`:

```json
{
  "dependencies": {
    "@swarmion/serverless-contracts": "*"
  },
  "pnpm": {
    "overrides": {
      "@swarmion/serverless-contracts": "link:../path/to/swarmion/packages/serverless-contracts"
    }
  }
}
```

And re-run `pnpm install` to link the package.

## Pull Request Guidelines

- Checkout a topic branch from a base branch, e.g. `main`, and merge back against that branch.

- If adding a new feature:

  - Add accompanying test case.
  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.

- If fixing bug:

  - If you are resolving a special issue, add `(fix #xxxx[,#xxxx])` (#xxxx is the issue id) in your PR title for a better release log, e.g. `fix: update entities encoding/decoding (fix #3899)`.
  - Provide a detailed description of the bug in the PR. Live demo preferred.
  - Add appropriate test coverage if applicable.

- It's OK to have multiple small commits as you work on the PR - GitHub can automatically squash them before merging.

- Make sure tests pass!

- Commit messages must follow the [commit message convention](./.github/commit-convention.md) so that changelogs can be automatically generated.

## Creating a release 🚀

### Prerequisites

You need to have an admin access setup locally to the `@swarmion` organization on the npm registry to be able to publish new versions of the packages.

### Usage

1. Make sure you are on the `main` branch and that the branch is up-to-date with the remote
1. Run the script with the necessary command-line arguments:

   ```bash
   ./release.sh <RELEASE_TYPE> [TARGET_VERSION]
   ```

   - `<RELEASE_TYPE>`: The type of release to perform (e.g., major, minor, patch, premajor, preminor, prepatch, or prerelease).
   - `[TARGET_VERSION]` (optional): The target version to set explicitly. If not provided, lerna will generate the version automatically.

1. After the script finished and a new tag is pushed, a new run of the [🔖 Release workflow](https://github.com/swarmion/swarmion/actions/workflows/release.yml) will be triggered. This workflow will create a draft GitHub release. Go ahead and review the release notes and publish the release.

### `release.sh` Bash Script Documentation

The `release.sh` script is a Bash script that automates the release process for swarmion. It performs the following actions:

1. Retrieves the release type from the first command-line argument (`$RELEASE_TYPE`) and optionally the target version from the second argument (`$TARGET_VERSION`).
2. Determines if an alpha release is required based on the release type.
3. Sets the new version for the project using `lerna version` command, either by generating it automatically or using the target version.
4. Ensures that all packages are up-to-date by running `pnpm install`, `pnpm package`, and `pnpm build`.
5. Creates a release commit with a signed message containing the new version.
6. Publishes the new version to npm, either as a regular release or an alpha release.
7. Waits for the changes to be available on npm for a brief period.
8. Upgrades packages in the project's examples to the new version.
9. Creates a tag for the new version and pushes the changes to the remote repository.

### Examples:

```bash
./release.sh patch
```

```bash
./release.sh premajor 2.0.0-alpha.1
```
