---
sidebar_position: 2
---

# From Babel to Tsup

## Why?

Swarmion used [Babel](https://babeljs.io/) to transpile internal library code. Babel made it possible to transform our Typescript code to plain Javascript (both CommonJS and ESModules).

However, we decided to migrate to [Tsup](https://tsup.egoist.dev/). It uses [Esbuild](https://esbuild.github.io/) and is much more efficient to transpile libraries.

For more context, check out [the migration PR](https://github.com/swarmion/swarmion/pull/347).

## How?

Before migrating from Babel to Tsup, we strongly recommend adding eslint `no-extraneous-dependencies` rule.

This will ensure you don't forget to specify your dependencies in your `package.json`. If you forget any, tsup will bundle them resulting in bigger bundle size.

- Enable `import/no-extraneous-dependencies` in your eslint config:
  ```js
  {
    files: ['**/src/**'],
    excludedFiles: ['**/__tests__/**', '**/*.test.ts?(x)'],
    rules: {
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: false,
          optionalDependencies: false,
          peerDependencies: true,
        },
      ],
    },
  },
  ```
- Fix dependency errors if there are any

Then, in each built package:

- Add `"./tsup.config.ts"`, to the `"exclude"` parameter in `tsconfig.build.json`
- Add the `tsup` dependency
- Add a `tsup.config.ts` file with:

  ```ts
  import { defineConfig } from 'tsup';

  export default defineConfig({
    entry: ['src/index.ts'],
    clean: true,
    silent: true,
    format: ['cjs', 'esm'],
    outExtension: ctx => {
      return { js: `.${ctx.format}.js` };
    },
    outDir: 'dist',
  });
  ```

- Replace the `"main"` and `"module"` fields in `package.json` with:
  ```json
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  ```
- Replace the `"package"` command with:
  ```json
  "package": "pnpm clean && pnpm package-transpile && pnpm package-types && pnpm package-types-aliases",
  "package-transpile": "tsup",
  ```
- Remove the `"package-cjs"`, `"package-esm"` and `"transpile"` commands
- Remove all `@babel` packages and `babel-plugin-module-resolver`
- Remove `babel.config.js`
- Remove the root babel config

And you're all set! You should be able to package your whole application using Tsup instead of Babel.
