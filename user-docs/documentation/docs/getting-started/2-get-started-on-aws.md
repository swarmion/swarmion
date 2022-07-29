---
sidebar_position: 2
---

# Get started on AWS

Your project is generated, it is almost ready to be deployed to AWS.

## Configure the deploy user

In order to deploy the stack on a development environment, you will need to setup a user on the stack.

:::caution
This step is only for the _development_ environment. For _staging_ and _production_ environment,
we recommend following the guidelines in the [configure your CI/CD section](../how-to-guides/configure-ci-cd).
:::

- Head to the [IAM console](https://console.aws.amazon.com/iamv2/home?#/users)
- Add a new user, give it a name (we will use `my-profile-name` in the following steps)
- In "AWS access type", select "Programmatic access", then click on "Next: permissions"
- Click on the "Attach existing policy directly", then select "AdministratorAccess" and click on "Next: tags"
- Click "Next: review", then "Create user"
- Do not close the window yet
- Choose a profile name for your dev environment
- Open a terminal and run: `aws configure --profile my-profile-name`
- Fill in the Access Key Id and the Secret Access Key from your user
- For the region, use the AWS region chosen for your project. See [the list of AWS regions](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/)
- Change the dev profile name in `packages/serverless-configuration/src/sharedConfig.ts`

## Deploy the stacks

At the root of the project, run `yarn deploy`. This will compile and deploy all the stacks in order.
You can follow the creation of the stacks on [the Cloudformation console](https://console.aws.amazon.com/cloudformation/home)

There will only be one stack deployed: `backend-core`.

(schema of the deployed architecture)

You should see this prompt at the end of the deployment:

(screenshot of the prompt)

You can call the API route, and receive the `"ok"` message.
