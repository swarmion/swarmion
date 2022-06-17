import { AWS } from '@serverless/typescript';
import { App, Stack } from 'aws-cdk-lib';
import merge from 'lodash/merge';
import * as Serverless from 'serverless';
import * as Plugin from 'serverless/classes/Plugin';

type CloudFormationTemplate = Exclude<AWS['resources'], undefined>;

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
const resolveConfigPath = require('serverless/lib/cli/resolve-configuration-path');

const resolveServerlessConfigPath = async (): Promise<string> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return await resolveConfigPath();
};

const getServerlessObject = async (): Promise<Serverless> => {
  const configPath = await resolveServerlessConfigPath();
  console.log(configPath);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const sls = await require(configPath);

  return sls as Serverless;
};

interface OptionsExtended extends Serverless.Options {
  verbose?: boolean;
}

export class ServerlessCdkPlugin implements Plugin {
  cliOptions: OptionsExtended;
  serverless: Serverless;
  hooks: Plugin.Hooks;
  commands: Plugin.Commands;
  log: Plugin.Logging['log'];
  stackName: string;
  app: App;
  stack: Stack;
  constructor(
    serverless: Serverless,
    cliOptions: OptionsExtended,
    { log }: Plugin.Logging,
  ) {
    this.cliOptions = cliOptions;
    this.log = log;

    this.serverless = serverless;

    this.commands = {};

    this.stackName = 'myStackName';

    this.app = new App();
    this.stack = new Stack(this.app, this.stackName);

    this.hooks = {
      initialize: async () => await this.instantiateConstruct(),
      'after:package:compileEvents': () => this.appendCloudformationResources(),
    };
  }

  appendCloudformationResources(): void {
    const { Resources, Outputs, Conditions, Mappings } = this.app
      .synth()
      .getStackByName(this.stackName).template as CloudFormationTemplate;

    merge(this.serverless.service, {
      resources: { Resources, Outputs, Conditions, Mappings },
    });
  }

  async instantiateConstruct(): Promise<void> {
    const sls = await getServerlessObject();

    // @ts-expect-error We well properly type the return of getServerlessObject later
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    new sls.custom.myConstruct(this.stack, 'myConstructId');
  }
}
