---
sidebar_position: 6
---

# Shared Typescript libraries

One of the main challenges of a Typescript monorepo is to build shared Typescript libraries. Packages are transpiled in cjs, esm (thanks to Babel) and .d.ts Typescript declaration file, to enable any usage across the monorepo.
