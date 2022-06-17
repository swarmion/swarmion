import { AWS } from '@serverless/typescript';
import { App, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import merge from 'lodash/merge';
import * as Serverless from 'serverless';
import * as Plugin from 'serverless/classes/Plugin';

type CloudFormationTemplate = Exclude<AWS['resources'], undefined>;
type ServerlessCdkBridge = Serverless & {
  serverlessCdkBridge: typeof Construct;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
const resolveConfigPath = require('serverless/lib/cli/resolve-configuration-path');

const resolveServerlessConfigPath = async (): Promise<string> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return await resolveConfigPath();
};

const getServerlessObject = async (): Promise<ServerlessCdkBridge> => {
  const configPath = await resolveServerlessConfigPath();
  console.log(configPath);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const sls = (await require(configPath)) as Serverless & {
    serverlessCdkBridge: any;
  };

  return sls as ServerlessCdkBridge;
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
    serverless.configSchemaHandler.defineTopLevelProperty('serverless-cdk', {
        type: 'object',
        properties: {
          serverlessCdkBridge: { type: 'object' },
        },
        required: ['serverlessCdkBridge'],
    });

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

    const MyConstruct = sls.serverlessCdkBridge;

    new MyConstruct(this.stack, 'myConstructId');
  }
}
