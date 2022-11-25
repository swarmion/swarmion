# @swarmion/nx-plugin

Generate new libraries and services in your Serverless monorepo.

This package is part of the [Swarmion](https://www.swarmion.dev) project. See its documentation for more insights.

## Installation

```bash
pnpm add --save-dev @swarmion/nx-plugin
```

or if using yarn

```bash
yarn add --dev @swarmion/nx-plugin
```

or if using npm

```bash
npm install --save-dev @swarmion/nx-plugin
```

Check out [the docs](https://www.swarmion.dev/docs/code-structure/nx-plugin) for more info.

## Contributing

### Integration tests

The `src/generators/library/library.test.ts` and `src/generators/service/service.test.ts` files contain integration tests.

They ensure that the generators have the correct behaviors without generating actual files.

They enable the use of TDD to add new features to the generators.

### Manual testing

To test the generators manually in the repo, add `@swarmion/nx-plugin` to the root `package.json`.

```bash
pnpm add -w --save-dev @swarmion/nx-plugin
```

Then run the following commands to test either of the generators:

```bash
pnpm nx g @swarmion/nx-plugin:library my-lib
pnpm nx g @swarmion/nx-plugin:service my-service
```

When testing if finished, remove the package from the root `package.json`, otherwise the `nx affected` command will fail (it would be a good idea to open an issue on the [nx repo](https://github.com/nrwl/nx) to fix this):

```bash
pnpm remove -w --save-dev @swarmion/nx-plugin
```
