import { App, Stack } from 'aws-cdk-lib';
import merge from 'lodash/merge.js';
import * as Serverless from 'serverless';
import * as Plugin from 'serverless/classes/Plugin';
import { O } from 'ts-toolbelt';

import {
  cdkPluginConfigSchema,
  CdkPluginConfigType,
  CloudFormationTemplate,
  ResolveVariable,
  ServerlessStack,
} from 'types';
import {
  camelize,
  getServerlessConfigFile,
  resolveVariablesInCdkOutput,
  throwIfBootstrapMetadataDetected,
} from 'utils';

interface OptionsExtended extends Serverless.Options {
  verbose?: boolean;
}

const DEFAULT_STACK_NAME = 'ServerlessCdkPlugin';

export class ServerlessCdkPlugin implements Plugin {
  cliOptions: OptionsExtended;
  serverless: Serverless;
  hooks: Plugin.Hooks;
  commands: Plugin.Commands;
  log: Plugin.Logging['log'];
  stackName: string;
  app: App;
  stack?: ServerlessStack | Stack;
  configurationVariablesSources?: Plugin.ConfigurationVariablesSources;
  constructInstantiationPromise?: Promise<void> = undefined;

  constructor(
    serverless: Serverless,
    cliOptions: OptionsExtended,
    { log }: Plugin.Logging,
  ) {
    serverless.configSchemaHandler.defineCustomProperties({
      type: 'object',
      properties: {
        cdkPlugin: cdkPluginConfigSchema,
      },
      required: ['cdkPlugin'],
    });

    this.cliOptions = cliOptions;
    this.log = log;

    this.serverless = serverless;

    this.commands = {};

    this.stackName = this.getStackName();

    this.app = new App({
      // Used to detect asset usage through metadata
      context: { 'aws:cdk:enable-asset-metadata': true },
    });

    this.hooks = {
      'after:package:compileEvents': async () => await this.resolveStack(),
    };

    this.configurationVariablesSources = {
      serverlessCdkBridgePlugin: {
        resolve: async ({
          resolveVariable,
          address,
        }: {
          resolveVariable: ResolveVariable;
          address: string;
        }) => {
          await this.resolveStack(resolveVariable);

          if (this.stack === undefined) {
            throw new Error('Stack has not been instanciated');
          }

          // Used to trigger variable resolution artificially, do not resolve cdk attribute here
          if (address === 'magicValue') {
            return { value: 'magicValue' };
          }

          if (!(address in this.stack)) {
            throw new Error('Unexpected');
          }

          return {
            // @ts-expect-error we cannot know at build time if the adress key is indeed in the construct
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            value: this.stack.resolve(this.stack[address]),
          };
        },
      },
    };
  }

  public static getCdkPropertyHelper = <T extends Stack>(
    prop: O.SelectKeys<Omit<T, keyof Stack>, string> & string,
  ): string => {
    return `$\{serverlessCdkBridgePlugin:${prop}}`;
  };

  public static ServerlessStack = ServerlessStack;

  async resolveStack(resolveVariable?: ResolveVariable): Promise<void> {
    if (
      this.stack === undefined &&
      this.constructInstantiationPromise === undefined
    ) {
      this.constructInstantiationPromise =
        this.instantiateStack(resolveVariable);
    }

    await this.constructInstantiationPromise;
  }

  async instantiateStack(resolveVariable?: ResolveVariable): Promise<void> {
    const serverlessConfigFile = await getServerlessConfigFile();
    const ConfigServerlessStack = serverlessConfigFile.custom.cdkPlugin.stack;

    const isServerlessStack =
      typeof ConfigServerlessStack === 'function' &&
      ConfigServerlessStack.prototype instanceof ServerlessStack;

    if (isServerlessStack) {
      this.stack = new ConfigServerlessStack(this.app, this.stackName, {
        config: serverlessConfigFile,
        service: this.serverless.service,
      });
    } else {
      this.stack = new ConfigServerlessStack(this.app, this.stackName);
    }

    await this.appendCloudformationResources(resolveVariable);
  }

  async appendCloudformationResources(
    resolveVariable?: ResolveVariable,
  ): Promise<void> {
    const { Resources, Outputs, Conditions, Mappings } = this.app
      .synth()
      .getStackByName(this.stackName).template as CloudFormationTemplate;

    const cdkCloudFormationData = { Resources, Outputs, Conditions, Mappings };

    await resolveVariablesInCdkOutput(cdkCloudFormationData, resolveVariable);

    throwIfBootstrapMetadataDetected({ Resources });

    merge(this.serverless.service, {
      resources: cdkCloudFormationData,
    });
  }

  getStackName(): string {
    const { stackName: configStackName } = this.serverless.service.custom
      .cdkPlugin as CdkPluginConfigType;

    const serviceName = this.serverless.service.service;

    if (configStackName !== undefined) {
      return configStackName;
    }

    if (serviceName !== null) {
      return camelize(serviceName);
    }

    return DEFAULT_STACK_NAME;
  }
}
