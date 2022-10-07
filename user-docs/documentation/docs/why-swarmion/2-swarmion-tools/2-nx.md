---
sidebar_position: 2
---

# Nx

[Nx](https://nx.dev/) is a powerful and extensible build system used to manage dependencies between packages, provide visualization of the monorepo dependencies through the [`pnpm nx graph` command](https://nx.dev/cli/dep-graph) and gain access to powerful custom generators. Our [nx plugin](../../how-to-guides/use-swarmion-generators) already has two generators, for libraries and serverless services (more are coming).

Nx also avoids unnecessary computation when running commands inside the monorepo, using local caching and changes detection for an smooth developer experience and an optimized CI/CD.
