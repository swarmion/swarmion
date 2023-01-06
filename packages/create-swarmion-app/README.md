# create-swarmion-app

Create a new project using the [Swarmion examples](https://github.com/swarmion/swarmion/tree/main/examples)

This package is part of the [Swarmion](https://www.swarmion.dev) project. See its documentation for more insights.

## Prerequisites

In order to use the latest create swarmion-app command, you should use [pnpm](https://pnpm.io/installation#using-corepack) as your package manager.

## Usage

Run the following command

```bash
pnpm create swarmion-app
```

Check out [the docs](https://www.swarmion.dev/docs/getting-started/installation#generate-your-project-from-swarmion-template) for more info.

## Acknowledge

Thank you to `next.js` that inspired our work on this create package

## Contributing

You can locally test this package by running from this directory

```bash
pnpm build
```

In another directory run

```bash
npm_config_user_agent=pnpm swarmion/swarmion/packages/create-swarmion-app/dist/index.js
```
