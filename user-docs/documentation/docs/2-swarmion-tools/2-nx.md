---
sidebar_position: 2
---

# Nx

Nx is a powerful and extensible build system used to manage dependencies between packages, provide visualization of the monorepo dependencies through the `yarn nx graph` command and gain access to powerful custom generators. Our nx plugin already has two generators, for libraries and serverless services (more are coming).

Nx also avoids unnecessary computation when running commands inside the monorepo, using local caching and changes detection for an smooth developer experience and an optimized CI/CD.
