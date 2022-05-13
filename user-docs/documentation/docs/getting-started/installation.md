---
sidebar_position: 1
---

# Installation

In this guide we'll see how to generate a Swarmion project from scratch. If you're looking how to migrate your existing project to Swarmion, please check out [the migration docs](../migrating).

_Please note: this section supposes that you already have an active AWS account._

## Requirements

- nvm: [install docs](https://github.com/nvm-sh/nvm#installing-and-updating)
- yarn: [install docs](https://yarnpkg.com/getting-started/install)
- AWS CLI: [install docs](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)

## Create a new project from the Swarmion template

Run the following command to init your Swarmion project

```bash
yarn create swarmion-app
```

## Cleanup the boilerplate example

Remove the following :

- `.all-contributorsrc` file
- `LICENSE.md` file
- `docs` folder
- `backend/forum` and `contracts/forum` folders
- `backend/user` and `contracts/user` folders

Update the following :

- in `workspace.json` remove from `projects`
  - `backend-forum`
  - `backend-users`
  - `user-contracts`
  - `forum-contracts`
- in `<app-name>.code-workspace` remove from `folders`
  - `backend/forum`
  - `backend/users`
  - `contracts/user-contracts`
  - `contracts/forum-contracts`

## Install modules

- `nvm use`: use the version of node set in `.nvmrc`;
- `yarn`: install node dependencies in all packages;
- `yarn package`: compile the common packages;
- `yarn test`: run all tests;
- `yarn upgrade-interactive` in order to bump all dependencies to their latest version. Be careful as it may introduce breaking changes;

## Configure the deploy user

In order to deploy the stack on a development environment, you will need to setup a user on the stack.

⚠️ This step is only for the development environment.

- Head to the [IAM console](https://console.aws.amazon.com/iamv2/home?#/users)
- Add a new user, give it a name
- In "AWS access type", select "Programmatic access", then click on "Next: permissions"
- Click on the "Attach existing policy directly", then select "AdministratorAccess" and click on "Next: tags"
- Click "Next: review", then "Create user"
- Do not close the window yet
- Choose a profile name for your dev environment
- Open a terminal and run: `aws configure --profile <your-profile>`
- Fill in the Access Key Id and the Secret Access Key from your user
- For the region, use the AWS region chosen for your project. See [the list of AWS regions](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/)
- Change the dev profile name in `packages/serverless-configuration/src/sharedConfig.ts`

## Deploy the stacks

At the root of the project, run `yarn deploy`. This will compile and deploy all the stacks in order.
You can follow the creation of the stacks on [the Cloudformation console](https://console.aws.amazon.com/cloudformation/home)

## Generate new Services

At the root of the project, run `yarn generate-service myService`. This will create a simple service in the repository's structure respecting our guidelines.

## Generate new Libraries

At the root of the project, run `yarn generate-library myLibrary`. This will create a simple internal library in the repository's structure respecting our guidelines.
