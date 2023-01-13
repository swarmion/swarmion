import type { AWS } from '@serverless/typescript';

type FunctionsIamRoleStatements = {
  iamRoleStatements?: AWS['provider']['iamRoleStatements'];
  iamRoleStatementsInherit?: boolean;
};

/**
 * The Lambda configuration type for Serverless Framework
 */
export type LambdaFunction = Exclude<AWS['functions'], undefined>[string] &
  FunctionsIamRoleStatements;

/**
 * The provider Serverless configuration
 */
export type ServerlessProviderConfig = AWS['provider'];
