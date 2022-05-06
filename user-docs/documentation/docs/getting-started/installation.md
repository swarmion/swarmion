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

Head over to the [Swarmion template](https://github.com/swarmion/template) on GitHub. Click the button _Use this template_ and follow the instructions.
![Use this template button](use_this_template_button.png)

## Change the project general settings

If you only want to run the example, you can skip this section.

If you want to take is as an example to start your own project,

- Go to the shared configuration file in `packages/serverless-configuration/src/sharedConfig.ts`
- Change the `projectName` variable to the name of your project (note that this name must not be too long)
- Search and replace "swarmion-starter" and replace it with the same project name
- Rename the `swarmion-starter.code-workspace` file at the root of the project to `<projectName>.code-workspace`
- Change the dev profile name to one that suits you
```
export const sharedParams = {
  dev: { profile: '<projectName>-developer' },
  ...
```

## Install modules

- `nvm use`: use the version of node set in `.nvmrc`;
- `yarn`: install node dependencies in all packages;
- `yarn package`: compile the common packages;
- `yarn test`: run all tests;
- `yarn upgrade-interactive --latest` in order to bump all dependencies to their latest version. Be careful as it may introduce breaking changes;

## Configure the deploy user

In order to deploy the stack on a development environment, you will need to setup a user on the stack.

⚠️ This step is only for the development environment.

- Head to the [IAM console](https://console.aws.amazon.com/iamv2/home?#/users);
- Add a new user, give it a name;
- In "AWS access type", select "Programmatic access", then click on "Next: permissions";
- Click on the "Attach existing policy directly", then select "AdministratorAccess" and click on "Next: tags";
- Click "Next: review", then "Create user";
- Do not close the window yet;
- Open a terminal and run: `aws configure --profile <your-profile>` (the value of `<your-profile>` depends of your choice in [the personalization section](#change-the-project-general-settings). By default it will be `swarmion-starter-developer`);
- Fill in the Access Key Id and the Secret Access Key from your user;
- For the region, use the AWS region chosen for your project. See [the list of AWS regions](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/).

## Deploy the stacks

At the root of the project, run `yarn deploy`. This will compile and deploy all the stacks in order.
You can follow the creation of the stacks on [the Cloudformation console](https://console.aws.amazon.com/cloudformation/home)

## Generate new Services

At the root of the project, run `yarn generate-service myService`. This will create a simple service in the repository's structure respecting our guidelines.

## Generate new Libraries

At the root of the project, run `yarn generate-library myLibrary`. This will create a simple internal library in the repository's structure respecting our guidelines.
