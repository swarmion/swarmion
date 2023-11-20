---
sidebar_position: 7
---

# Choosing our schema validation library

Since the start of Swarmion, we used json-schema-to-ts to generate types from json schemas. This library is a great tool, but we encountered some limitations after using it for a while:

- Writing json schemas is not very intuitive. It is not easy to write a schema that validates a complex object for new developers using swarmion.
- We encountered some performance issues with repositories that have a lot of json schemas with FromSchema type inference used on them.

Thus, we decided to explore other options. After some search, we decided to check [zod](https://github.com/colinhacks/zod) and [typia](https://github.com/samchon/typia)

Our comparison points are base on those criteria:

1. Ease of write
2. IDE performance
3. External interface translation (open-api doc, AWS direct integration)
4. Typescript ecosystem
5. Runtime performance
6. Additional features (i.e extending typescript possibilities, form validation, ...)
7. Marketing

### TL;DR: We chose to keep json-schema-to-ts implementation to not introduce a breaking change, and we will create zod serverless contracts and promote them in the documentation.

## Ease of write

We write a lot of schemas with swarmion, so we need a library that is easy to write and understand.

### json-schema-to-ts / ajv

- ✅ Pros:
  - Based on a standardized format
  - Complete and well maintained (🤎 Thomus)
- ❌ Cons:
  - Very verbose
  - Not very intuitive
  - No autocomplete in IDE because of the `as const` syntax
  - Can easily produce invalid schemas, which are only detected when applying the FromSchema inference (or using the satisfies typescript keyword)
  - Schema composition / modularity can be tricky

### zod

- ✅ Pros:
  - Intuitive
  - Autocomplete in IDE
  - Good modularity in schema definition
- ❌ Cons:
  - Not standardized
  - Still need to read the documentation for first schemas

### typia

- ✅ Pros:
  - Literally writing typescript type
  - No lib knowledge needed
- ❌ Cons:
  - codegen

## IDE performance

See [this repo analysis](https://github.com/Sc0ra/type-perf-test) for more details

### json-schema-to-ts / ajv

- ✅ Pros:
  - Schema definition is quick (basic types)
- ❌ Cons:
  - Type inference is slow because it needs to parse the schema recursively every time

### zod

- ✅ Pros:
  - Type inference is really quick (up to 10x faster than json-schema-to-ts)
- ❌ Cons:
  - First schema instantiation in IDE typescript language server is slow, but contracts are cached after that

### typia

- ✅ Pros:
  - Fastest

## External interface translation

At build or runtime, we need to translate our types to external interfaces (open-api doc, AWS direct integration, ...)

### json-schema-to-ts / ajv

- ✅ Pros:
  - json-schema by definition
  - we developed the open-api translation
- ❌ Cons:
  - Type inference is slow because it needs to parse the schema recursively every time

### zod

- ✅ Pros:
  - https://www.npmjs.com/package/zod-to-json-schema
  - https://github.com/asteasolutions/zod-to-openapi
- ❌ Cons:
  - Depends on external libraries

### typia

- ❌ Cons:
  - Translation to a runtime object is only done at runtime
  - We would need to use codegen libs like https://www.npmjs.com/package/typescript-json-schema to generate a runtime / buildtime object
  - There could be differences between the runtime check and the generated format because of the codegen

## Typescript ecosystem

We need a lib which is well supported by the typescript ecosystem

### json-schema-to-ts / ajv

- ✅ Pros:
  - 390 197 weekly downloads
  - 1k stars
  - Thomus 🤎
  - ajv is also big in the ecosystem and well maintained
- ❌ Cons:
  - A bit smaller than zod and typia

### zod

- ✅ Pros:
  - 2 429 757 weekly downloads
  - 2O,3k stars
  - Core maintainer is crazy active
  - Big libs driving the development: trpc, react-hook-form, ...

### typia

- ✅ Pros:
  - 2,3k stars
  - An article about this lib buzzed
- ❌ Cons:
  - 3 666 weekly downloads: strange ratio compared to stars count
  - Not used on any project I know

## Runtime performance

Not the most important factor in most of our use cases but still important

Based on the typia doc whi compare ajv, zod and typia in this [doc](https://github.com/samchon/typia/wiki/Runtime-Validators), the ranking is:

1. typia
2. json-schema-to-ts / ajv
3. zod

## Additional features (i.e extending typescript possibilities, form validation, ...)

### json-schema-to-ts / ajv

- ✅ Pros:
  - ajv is a very complete lib
  - basic keyword like pattern or min etc already extends typescript validation possibilities
  - possiblity to add keywords and custom validation with ajv
  - there are form validation libs
- ❌ Cons:
  - The syntax is not very intuitive
  - It's configuration as text
  - form validation libs are not the most well maintained

## zod

- ✅ Pros:
  - complete extension with custom code
  - form integration, well maintained

## typia

- ❌ Pros:
  - No form lib integration
  - Limited to typescript possibilities (no min, max on number for example)

## Marketing

Zod is by far the most popular lib, it is good for SEO of the repository, and we might be listed on [this section](https://github.com/colinhacks/zod#ecosystem) at the start of their documentation.
