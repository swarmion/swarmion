import {
  GitHubSourceCodeProvider,
  GitHubSourceCodeProviderProps,
} from '@aws-cdk/aws-amplify-alpha';
import { SecretValue } from 'aws-cdk-lib';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const githubConfiguration: GitHubSourceCodeProviderProps = {
  owner: process.env.GITHUB_OWNER ?? 'undefined',
  repository: process.env.GITHUB_REPO ?? 'undefined',
  // Fill your secret in AWS Secrets Manager, as plain text, with the name defined in .env
  oauthToken: SecretValue.secretsManager(
    process.env.GITHUB_OAUTH_TOKEN_SECRET_NAME ?? 'undefined',
  ),
};

export const sourceCodeProvider = new GitHubSourceCodeProvider(
  githubConfiguration,
);
