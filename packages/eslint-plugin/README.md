# @serverless-contracts/eslint-plugin

An eslint plugin with rules to enforces proper usage of contracts.

### Installation

```bash
npm install --save-dev @serverless-contracts/eslint-plugin
```

or if using yarn

```bash
yarn add --dev @serverless-contracts/eslint-plugin
```

### Usage

Add `@serverless-contracts` to the plugins section of your `.eslintrc` configuration file, then configure the rules you want to use under the rules section.

```json
{
  "plugins": ["@serverless-contracts"],
  "rules": {
    "@serverless-contracts/rule-name": "error"
  }
}
```

You can also enable all the recommended rules for our plugin. Add `plugin:@serverless-contracts/recommended` in extends:

```json
{
  "extends": ["plugin:@serverless-contracts/recommended"]
}
```

### Rules

**Key**: :white_check_mark: = recommended, :wrench: = fixable

| Name                                            | Description                                                            | :white_check_mark: | :wrench: |
| ----------------------------------------------- | ---------------------------------------------------------------------- | ------------------ | -------- |
| `@serverless-contracts/no-undeclared-contracts` | Require that used contracts are defined in the serverless service file | :white_check_mark: |          |
