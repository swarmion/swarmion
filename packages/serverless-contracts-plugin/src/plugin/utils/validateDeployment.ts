import JsonSchemaDiff from 'json-schema-diff';
import { JSONSchema } from 'json-schema-to-ts';

import { DeploymentStrategies } from 'types/deploymentTypes';
import {
  RemoteServerlessContractSchemas,
  ServerlessContractSchemas,
} from 'types/serviceOptions';

export const validateDeployment = async (
  localContracts: ServerlessContractSchemas,
  remoteContracts: RemoteServerlessContractSchemas,
  deploymentStrategy: DeploymentStrategies,
): Promise<void> => {
  if (deploymentStrategy === DeploymentStrategies.PROVIDER_FIRST) {
    await validateProviderFirstDeployment(localContracts, remoteContracts);
  } else {
    await validateConsumerFirstDeployment(localContracts, remoteContracts);
  }
};

/**
 * validate a provider-first deployment.
 *
 * In this case, we need to check that:
 * - the contracts provided by the remote are still all provided by the local version
 *
 * @param localContractSchemas
 * @param remoteContractSchemas
 */
const validateProviderFirstDeployment = async (
  localContractSchemas: ServerlessContractSchemas,
  remoteContractSchemas: RemoteServerlessContractSchemas,
): Promise<void> => {
  const { provides: localProvides } = localContractSchemas;
  const { provides: remoteProvides } = remoteContractSchemas;

  // in this case we need to check all the remote provided are still provided
  await Promise.all(
    Object.entries(remoteProvides).map(
      async ([contractName, remoteContractSchema]) => {
        const localContractSchema = localProvides[contractName] as
          | JSONSchema
          | undefined;

        if (localContractSchema === undefined) {
          throw new Error(`Expected to find local contract: ${contractName}`);
        }

        const { removalsFound } = await JsonSchemaDiff.diffSchemas({
          // @ts-ignore this is not well typed
          sourceSchema: remoteContractSchema,
          // @ts-ignore this is not well typed
          destinationSchema: localContractSchema,
        });

        if (removalsFound) {
          throw new Error(
            `Unexpected removal in provided contract schema: ${contractName}`,
          );
        }
      },
    ),
  );
};

/**
 * validate a consumer-first deployment.
 *
 * In this case, we need to check that:
 * - the local version does not consume more than the remote
 *
 * @param localContractSchemas
 * @param remoteContractSchemas
 */
const validateConsumerFirstDeployment = async (
  localContractSchemas: ServerlessContractSchemas,
  remoteContractSchemas: RemoteServerlessContractSchemas,
): Promise<void> => {
  const { consumes: localConsumes } = localContractSchemas;
  const { consumes: remoteConsumes } = remoteContractSchemas;

  // the local version does not consume more than the remote
  await Promise.all(
    Object.entries(localConsumes).map(
      async ([contractName, localContractSchema]) => {
        const remoteContractSchema = remoteConsumes[contractName] as
          | JSONSchema
          | undefined;

        if (remoteContractSchema === undefined) {
          throw new Error(`Expected to find remote contract: ${contractName}`);
        }

        const { additionsFound } = await JsonSchemaDiff.diffSchemas({
          // @ts-ignore this is not well typed
          sourceSchema: remoteContractSchema,
          // @ts-ignore this is not well typed
          destinationSchema: localContractSchema,
        });

        if (additionsFound) {
          throw new Error(
            `Unexpected addition in consumed contract schema: ${contractName}`,
          );
        }
      },
    ),
  );
};
