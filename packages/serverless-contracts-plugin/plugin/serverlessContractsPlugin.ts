import * as Serverless from 'serverless';
import * as Plugin from 'serverless/classes/Plugin';

import { DeploymentStrategies } from '../types/deploymentTypes';
import { ContractsLocation } from '../types/locations';
import {
  RemoteServerlessContracts,
  ServerlessContracts,
  serviceOptionsSchema,
} from '../types/serviceOptions';
import { getTimestampFromArtifactDirectoryName } from './utils/artifactDirectory';
import { LATEST_DEPLOYED_TIMESTAMP_TAG_NAME } from './utils/constants';
import { listLocalContracts } from './utils/listLocalContracts';
import { listRemoteContracts } from './utils/listRemoteContracts';
import { printContracts } from './utils/printContracts';
import { uploadContracts } from './utils/uploadContracts';
import { validateDeployment } from './utils/validateDeployment';

interface OptionsExtended extends Serverless.Options {
  verbose?: boolean;
  strategy?: DeploymentStrategies;
}

export class ServerlessContractsPlugin implements Plugin {
  options: OptionsExtended;
  serverless: Serverless;
  hooks: Plugin.Hooks;
  commands: Plugin.Commands;

  constructor(serverless: Serverless, options: OptionsExtended) {
    this.options = options;
    // validate the 'strategy' argument
    if (
      this.options.strategy !== undefined &&
      !Object.values(DeploymentStrategies).includes(this.options.strategy)
    ) {
      throw new Error(
        `Invalid deployment strategy. Choices are ${JSON.stringify(
          Object.values(DeploymentStrategies),
        )}`,
      );
    }
    this.serverless = serverless;

    // add validation schema for options
    serverless.configSchemaHandler.defineTopLevelProperty(
      'contracts',
      serviceOptionsSchema,
    );

    this.commands = {
      localContracts: {
        usage: 'Show local Serverless contracts',
        lifecycleEvents: ['run'],
      },
      remoteContracts: {
        usage: 'Show currently deployed Serverless contracts',
        lifecycleEvents: ['run'],
      },
      safeDeploy: {
        usage: 'Deploy you service and specify the deployment strategy',
        lifecycleEvents: ['run'],
        options: {
          // Define the '--strategy' option with the '-s' shortcut
          strategy: {
            usage: 'Specify the deployment strategy',
            shortcut: 's',
            required: true,
            // @ts-ignore mistype in @types/serverless
            type: 'string',
          },
        },
      },
    };
    this.hooks = {
      'localContracts:run': this.printLocalServerlessContracts.bind(this),
      'remoteContracts:run': this.printRemoteServerlessContracts.bind(this),
      'safeDeploy:run': this.deployWithContractsValidation.bind(this),
      'before:deploy:deploy': this.validateDeployment.bind(this),
      'before:package:finalize': this.tagStackWithTimestamp.bind(this),
      'after:aws:deploy:deploy:uploadArtifacts':
        this.uploadContracts.bind(this),
    };
  }

  /**
   * This command is merely a wrapper around the `deploy` command from the serverless Framework,
   * leveraging the use of the `--strategy` option.
   * Therefore, while this option has been set in the constructor, all we need to to is
   * launch the serverless framework deployment
   */
  async deployWithContractsValidation(): Promise<void> {
    await this.serverless.pluginManager.spawn('deploy');
  }

  listLocalContracts(): ServerlessContracts {
    return listLocalContracts(this.serverless);
  }

  printLocalServerlessContracts(): void {
    const contracts = this.listLocalContracts();
    printContracts(contracts, ContractsLocation.LOCAL);
  }

  async printRemoteServerlessContracts(): Promise<void> {
    const contracts = await this.listRemoteContracts();
    if (contracts === undefined) {
      this.serverless.cli.log(
        'Unable to retrieve remote contracts',
        'Contracts',
      );

      return;
    }
    printContracts(contracts, ContractsLocation.REMOTE);
  }

  async listRemoteContracts(): Promise<RemoteServerlessContracts | undefined> {
    return listRemoteContracts(this.serverless);
  }

  tagStackWithTimestamp(): void {
    const artifactDirectoryName = this.serverless.service.package
      .artifactDirectoryName as string;

    const timestamp = getTimestampFromArtifactDirectoryName(
      artifactDirectoryName,
    );

    this.serverless.service.provider.stackTags = {
      ...this.serverless.service.provider.stackTags,
      [LATEST_DEPLOYED_TIMESTAMP_TAG_NAME]: timestamp,
    };
  }

  async uploadContracts(): Promise<void> {
    await uploadContracts(this.serverless);
  }

  async validateDeployment(): Promise<void> {
    const localContracts = listLocalContracts(this.serverless);
    const remoteContracts = await listRemoteContracts(this.serverless);
    if (remoteContracts === undefined) {
      this.serverless.cli.log(
        'Unable to retrieve remote contracts, deployment is unsafe',
        'Contracts',
      );

      return;
    }

    this.serverless.cli.log('Validating contracts...', 'Contracts');

    await validateDeployment(
      localContracts,
      remoteContracts,
      this.options.strategy ?? DeploymentStrategies.PROVIDER_FIRST,
    );
  }
}
