import { GitHubSourceCodeProvider } from '@aws-cdk/aws-amplify-alpha';
import { SecretValue } from 'aws-cdk-lib';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const githubConfiguration = {
  owner: process.env.GITHUB_OWNER ?? 'undefined',
  repository: process.env.GITHUB_REPO ?? 'undefined',
  oauthToken: SecretValue.unsafePlainText(
    process.env.GITHUB_OAUTH_TOKEN ?? 'undefined',
  ),
};

export const sourceCodeProvider = new GitHubSourceCodeProvider(
  githubConfiguration,
);
