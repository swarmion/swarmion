import * as Serverless from 'serverless';
import * as Plugin from 'serverless/classes/Plugin';

import { DeploymentStrategies } from '../types/deploymentTypes';
import { ContractSchemasLocation } from '../types/locations';
import {
  RemoteServerlessContractSchemas,
  ServerlessContractSchemas,
  serviceOptionsSchema,
} from '../types/serviceOptions';
import { getTimestampFromArtifactDirectoryName } from './utils/artifactDirectory';
import { LATEST_DEPLOYED_TIMESTAMP_TAG_NAME } from './utils/constants';
import { generateOpenApiDocumentation } from './utils/generateOpenApiDocumentation';
import { listContractSchemas } from './utils/listContractSchemas';
import { listLocalContractSchemas } from './utils/listLocalContractSchemas';
import { listRemoteContractSchemas } from './utils/listRemoteContractSchemas';
import { printContractSchemas } from './utils/printContractSchemas';
import { uploadContractSchemas } from './utils/uploadContractSchemas';
import { validateDeployment } from './utils/validateDeployment';

interface OptionsExtended extends Serverless.Options {
  verbose?: boolean;
  strategy?: DeploymentStrategies;
}

export class ServerlessContractsPlugin implements Plugin {
  cliOptions: OptionsExtended;
  serverless: Serverless;
  hooks: Plugin.Hooks;
  commands: Plugin.Commands;
  log: Plugin.Logging['log'];

  constructor(
    serverless: Serverless,
    cliOptions: OptionsExtended,
    { log }: Plugin.Logging,
  ) {
    this.cliOptions = cliOptions;
    this.log = log;
    // validate the 'strategy' argument
    if (
      this.cliOptions.strategy !== undefined &&
      !Object.values(DeploymentStrategies).includes(this.cliOptions.strategy)
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
      listContractSchemas: {
        usage: 'List Serverless contract Schemas',
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
      generateOpenApiDocumentation: {
        usage:
          'Generate OpenAPI with local Serverless contracts provided by the service',
        lifecycleEvents: ['run'],
      },
    };
    this.hooks = {
      'localContracts:run': this.printLocalServerlessContractSchemas.bind(this),
      'listContractSchemas:run': this.listContractSchemas.bind(this),
      'remoteContracts:run':
        this.printRemoteServerlessContractSchemas.bind(this),
      'safeDeploy:run': this.deployWithContractSchemasValidation.bind(this),
      'before:deploy:deploy': this.validateDeployment.bind(this),
      'before:package:finalize': this.tagStackWithTimestamp.bind(this),
      'after:aws:deploy:deploy:uploadArtifacts':
        this.uploadContractSchemas.bind(this),
      'generateOpenApiDocumentation:run':
        this.generateOpenApiDocumentation.bind(this),
    };
  }

  /**
   * This command is merely a wrapper around the `deploy` command from the serverless Framework,
   * leveraging the use of the `--strategy` option.
   * Therefore, while this option has been set in the constructor, all we need to to is
   * launch the serverless framework deployment
   */
  async deployWithContractSchemasValidation(): Promise<void> {
    await this.serverless.pluginManager.spawn('deploy');
  }

  listLocalContractSchemas(): ServerlessContractSchemas {
    return listLocalContractSchemas(this.serverless);
  }

  printLocalServerlessContractSchemas(): void {
    const contractSchemas = this.listLocalContractSchemas();
    printContractSchemas(contractSchemas, ContractSchemasLocation.LOCAL);
  }
  async listContractSchemas(): Promise<void> {
    return await listContractSchemas(this.serverless);
  }

  async printRemoteServerlessContractSchemas(): Promise<void> {
    const contractSchemas = await this.listRemoteContractSchemas();
    if (contractSchemas === undefined) {
      this.log.error('Unable to retrieve remote contract schemas');

      return;
    }
    printContractSchemas(contractSchemas, ContractSchemasLocation.REMOTE);
  }

  async listRemoteContractSchemas(): Promise<
    RemoteServerlessContractSchemas | undefined
  > {
    return listRemoteContractSchemas(this.serverless);
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

  async uploadContractSchemas(): Promise<void> {
    await uploadContractSchemas(this.serverless, this.log);
  }

  async validateDeployment(): Promise<void> {
    const localContractSchemas = listLocalContractSchemas(this.serverless);
    const remoteContractSchemas = await listRemoteContractSchemas(
      this.serverless,
    );
    if (remoteContractSchemas === undefined) {
      this.log.warning(
        'Contracts: Unable to retrieve remote contract schemas, deployment is unsafe',
      );

      return;
    }

    if (this.cliOptions.strategy !== undefined) {
      this.log.info('Validating contract schemas...');

      await validateDeployment(
        localContractSchemas,
        remoteContractSchemas,
        this.cliOptions.strategy,
      );
    }
  }

  generateOpenApiDocumentation(): void {
    generateOpenApiDocumentation(this.serverless);
  }
}
