declare module '@serverless/test/run-serverless' {
  import type { AWS } from '@serverless/typescript';

  type RunServerlessBaseOptions = Partial<{
    command: string;
    options: Record<string, boolean | string>;
    configExt: Partial<AWS> | Record<string, unknown>;
    env: Record<string, string>;
    awsRequestStubMap: unknwon;
  }>;

  type RunServerlessFixtureOption = {
    fixture: string;
  };
  type RunServerlessCWDOption = {
    cwd: string;
  };
  type RunServerlessConfigOption = {
    config: AWS;
  };
  type RunServerlessNoServiceOption = {
    noService: boolean;
  };

  type RunServerlessOptions = RunServerlessBaseOptions &
    (
      | RunServerlessFixtureOption
      | RunServerlessCWDOption
      | RunServerlessConfigOption
      | RunServerlessNoServiceOption
    );

  type RunServerlessReturn = {
    serverless: Record<string, unknown>;
    stdoutData: string;
    cfTemplate: {
      Resources: Record<string, { Properties: Record<string, unknown> }>;
      Outputs: Record<string, unknown>;
    };
    awsNaming: unknown;
  };

  function runServerless(
    serverlessPath: string,
    options: RunServerlessOptions,
  ): Promise<RunServerlessReturn>;

  export = runServerless;
}
