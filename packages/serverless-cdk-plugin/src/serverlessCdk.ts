import { App, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import merge from 'lodash/merge';
import * as Serverless from 'serverless';
import * as Plugin from 'serverless/classes/Plugin';
import resolveConfigPath from 'serverless/lib/cli/resolve-configuration-path';

import { CdkPluginConfig, ServerlessConstruct } from 'helper';
import { CloudFormationTemplate } from 'types';
import { throwIfBootstrapMetadataDetected } from 'utils';

type ServerlessConfigFile = Serverless & CdkPluginConfig;

const resolveServerlessConfigPath = async (): Promise<string> => {
  return resolveConfigPath();
};

const getServerlessConfigFile = async (): Promise<ServerlessConfigFile> => {
  const configPath = await resolveServerlessConfigPath();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const serverlessConfigFile = (await require(configPath)) as Serverless & {
    serverlessConstruct: unknown;
  };

  const MyConstruct = serverlessConfigFile.serverlessConstruct;
  if (MyConstruct === undefined) {
    throw new Error(
      'Missing serverlessConstruct property in serverless configuration',
    );
  }

  const isConstruct =
    typeof MyConstruct === 'function' &&
    (MyConstruct.prototype instanceof ServerlessConstruct ||
      MyConstruct.prototype instanceof Construct);

  if (!isConstruct) {
    throw new Error(
      'serverlessConstruct should be a ServerlessConstruct or a Construct',
    );
  }

  return serverlessConfigFile as ServerlessConfigFile;
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
  configurationVariablesSources?: Plugin.ConfigurationVariablesSources;
  construct?: ServerlessConstruct;
  constructInstantiationPromise?: Promise<void> = undefined;

  constructor(
    serverless: Serverless,
    cliOptions: OptionsExtended,
    { log }: Plugin.Logging,
  ) {
    serverless.configSchemaHandler.defineTopLevelProperty(
      'serverlessConstruct',
      {
        type: 'object', // A class is an object
      },
    );

    this.cliOptions = cliOptions;
    this.log = log;

    this.serverless = serverless;

    this.commands = {};

    this.stackName = 'myStackName';

    this.app = new App({
      // Used to detect asset usage through metadata
      context: { 'aws:cdk:enable-asset-metadata': true },
    });
    this.stack = new Stack(this.app, this.stackName);

    this.hooks = {
      initialize: async () => await this.resolveConstruct(),
      'after:package:compileEvents': () => this.appendCloudformationResources(),
    };

    this.configurationVariablesSources = {
      serverlessCdkBridgePlugin: {
        resolve: async ({ address }: { address: string }) => {
          await this.resolveConstruct();

          if (this.construct === undefined) {
            throw new Error('Construct has not been instanciated');
          }

          if (!(address in this.construct)) {
            throw new Error('Unexpected');
          }

          return {
            // @ts-expect-error we cannot know at build time if the adress key is indeed in the construct
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            value: this.stack.resolve(this.construct[address]),
          };
        },
      },
    };
  }

  async resolveConstruct(): Promise<void> {
    if (
      this.construct === undefined &&
      this.constructInstantiationPromise === undefined
    ) {
      this.constructInstantiationPromise = this.instantiateConstruct();
    }

    await this.constructInstantiationPromise;
  }

  async instantiateConstruct(): Promise<void> {
    const serverlessConfigFile = await getServerlessConfigFile();
    const ServerlessCdkConstruct = serverlessConfigFile.serverlessConstruct;

    this.construct = new ServerlessCdkConstruct(
      this.stack,
      'serverlessCdkBridgeConstruct',
      { serverless: serverlessConfigFile },
    );
  }

  appendCloudformationResources(): void {
    const { Resources, Outputs, Conditions, Mappings } = this.app
      .synth()
      .getStackByName(this.stackName).template as CloudFormationTemplate;

    throwIfBootstrapMetadataDetected({ Resources });

    merge(this.serverless.service, {
      resources: { Resources, Outputs, Conditions, Mappings },
    });
  }
}
