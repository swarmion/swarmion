---
sidebar_position: 2
---

# From Babel to Tsup

## Why?

Coming soon...

## How?

In order to migrate from Babel to Tsup:

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
    clean: true,
    silent: true,
    format: ['cjs', 'esm'],
    outDir: 'dist',
  });
  ```

- Replace the `"main"` and `"module"` fields in `package.json` with:
  ```json
  "main": "dist/index.cjs.js",
  "module": "dist/index.js",
  ```
- Replace the `"package"` command with:
  ```json
  "package": "pnpm clean && pnpm package-transpile && pnpm package-types && pnpm package-types-aliases",
  "package-transpile": "tsup src/index.ts",
  ```
- Remove the `"package-cjs"`, `"package-esm"` and `"transpile"` commands
- Remove all `@babel` packages and `babel-plugin-module-resolver`
- Remove `babel.config.js`
- Remove the root babel config

And you're all set! You should be able to package your whole application using Tsup instead of Babel.
