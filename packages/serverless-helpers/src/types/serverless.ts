import type { AWS } from '@serverless/typescript';

type FunctionsIamRoleStatements = {
  iamRoleStatements?: AWS['provider']['iamRoleStatements'];
  iamRoleStatementsInherit?: boolean;
};

export type LambdaFunction = Exclude<AWS['functions'], undefined>[string] &
  FunctionsIamRoleStatements;
