---
sidebar_position: 3
---

# Libraries

## Library types

Libraries are packaged modules. Their purpose is to be **built** (or **packaged**) and embedded into the code of a deployed service.

They are divided into two main types of libraries that only differ in their usage.

**Contracts** provide explicit type-safe interfaces between deployed services, that can be statically checked at compile time and and validated at runtime using JSONSchema. For more details on contracts, see the [contracts documentation](../serverless-contracts/concepts).

**Packages** reduce code duplication between services by providing shared logic and configuration. These packages must not become too big in order for them to remain usable and must be well documented.

## Library structure

A typical Swarmion library has the following structure:

```
├── my-library/
|   ├── src/
|   |   ├── index.ts             # all exported code from the library MUST be referenced in this file
|   |   ├── myFirstFolder/
|   |   |   ├── index.ts         # all exported code from the folder MUST be referenced in this file
|   |   |   └── ...              # other files and folders
|   |   ├── mySecondFolder/
|   |   |   ├── index.ts         # all exported code from the folder MUST be referenced in this file
|   |   |   └── ...              # other files and folders
|   |   └── ...                  # other files and folders
|   ├── package.json             # library dependencies
|   └── tsconfig.json            # Typescript configuration
```

## The golden rule of libraries

In order to safely use code from a library outside of it, **all exported code must be explicitly declared at the root level**.

## Generate a library

You can generate a new library respecting these guidelines using the [@swarmion/nx-plugin](../../how-to/use-swarmion-generators)
