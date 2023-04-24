This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Amplify

### Installation

To deploy the NextJs application to an Amplify stack, in the frontend next app directory:

1. Setup your repository configuration in [`sourceCodeProvider.ts`](./hosting/settings/sourceCodeProvider.ts)

   > By default, a GitHub configuration is proposed. You need to create a GitHub token with `repo` scope and should store it safely in AWS Secrets Manager. Then, you need to update your `.env` (copy `.env.example`) with the GitHub owner, repository name and the key used in Secrets Manager to store the token.

2. Deploy the Amplify stack by running

   ```sh
   pnpm bootstrap
   pnpm run deploy
   ```

   _NB: `pnpm bootstrap` is required only once to bootstrap a CDK stack._

### Uninstall

To destroy the Amplify stack, run

```sh
pnpm run remove
```

### Continuous Deployment

This project comes with a ready-to-use deployment configuration:

- The project will be redeployed each time changes are detected on the `main` branch.
  It is possible to change the default branch configuration in [`branchSettings.ts`](./hosting/settings/branchSettings.ts)
- Whenever a branch starts with `feature/`, a preview will be built and deployed.
  It is possible to update this branch preview configuration in [`branchSettings.ts`](./hosting/settings/branchSettings.ts)

To include the app deployment in an advanced Continuous Deployment pipeline, you may use [webhooks](https://docs.aws.amazon.com/amplify/latest/userguide/webhooks.html). There is no CDK configuration available for now, but some commands are available in the [AWS CLI](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/amplify/create-webhook.html) to automate the process.

## Deploy on Vercel

Another way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
