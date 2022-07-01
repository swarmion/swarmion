import { AWS } from '@serverless/typescript';
import { App, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import merge from 'lodash/merge';
import * as Serverless from 'serverless';
import * as Plugin from 'serverless/classes/Plugin';
import resolveConfigPath from 'serverless/lib/cli/resolve-configuration-path';
import { O } from 'ts-toolbelt';

type CloudFormationTemplate = Exclude<AWS['resources'], undefined>;

const resolveServerlessConfigPath = async (): Promise<string> => {
  return resolveConfigPath();
};

const getServerlessObject = async (): Promise<Serverless> => {
  const configPath = await resolveServerlessConfigPath();

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
  configurationVariablesSources?: Plugin.ConfigurationVariablesSources;
  construct?: Construct;
  constructInstantiationPromise?: Promise<void> = undefined;

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
    const sls = await getServerlessObject();
    // @ts-expect-error We will properly type the return of getServerlessObject later
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    this.construct = new sls.custom.myConstruct(
      this.stack,
      'serverlessCdkBridgeConstruct',
    );
  }

  appendCloudformationResources(): void {
    const { Resources, Outputs, Conditions } = this.app
      .synth()
      .getStackByName(this.stackName).template as CloudFormationTemplate;

    merge(this.serverless.service, {
      resources: { Resources, Outputs, Conditions },
    });
  }
}

export const getCdkProperty = <T extends Construct>(
  prop: O.SelectKeys<T, string> & string,
): string => {
  return `$\{serverlessCdkBridgePlugin:${prop}}`;
};
