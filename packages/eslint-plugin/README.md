# @swarmion/eslint-plugin

An eslint plugin with rules to enforces proper usage of contracts.

This package is part of the [Swarmion](https://www.swarmion.dev) project. See its documentation for more insights.

### Installation

```bash
pnpm add --save-dev @swarmion/eslint-plugin
```

or if using yarn

```bash
yarn add --dev @swarmion/eslint-plugin
```

or if using npm

```bash
npm install --save-dev @swarmion/eslint-plugin
```

### Usage

Add `@swarmion` to the plugins section of your `.eslintrc` configuration file, then configure the rules you want to use under the rules section.

```json
{
  "plugins": ["@swarmion"],
  "rules": {
    "@swarmion/rule-name": "error"
  }
}
```

You can also enable all the recommended rules for our plugin. Add `plugin:@swarmion/recommended` in extends:

```json
{
  "extends": ["plugin:@swarmion/recommended"]
}
```

### Rules

**Key**: :white_check_mark: = recommended, :wrench: = fixable

| Name                                | Description                                                            | :white_check_mark: | :wrench: |
| ----------------------------------- | ---------------------------------------------------------------------- | ------------------ | -------- |
| `@swarmion/no-undeclared-contracts` | Require that used contracts are defined in the serverless service file | :white_check_mark: |          |
