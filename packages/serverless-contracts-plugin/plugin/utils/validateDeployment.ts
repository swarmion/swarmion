import JsonSchemaDiff from 'json-schema-diff';
import { JSONSchema } from 'json-schema-to-ts';

import { DeploymentStrategies } from '../../types/deploymentTypes';
import {
  RemoteServerlessContracts,
  ServerlessContracts,
} from '../../types/serviceOptions';

export const validateDeployment = async (
  localContracts: ServerlessContracts,
  remoteContracts: RemoteServerlessContracts,
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
 * @param localContracts
 * @param remoteContracts
 */
const validateProviderFirstDeployment = async (
  localContracts: ServerlessContracts,
  remoteContracts: RemoteServerlessContracts,
): Promise<void> => {
  const { provides: localProvides } = localContracts;
  const { provides: remoteProvides } = remoteContracts;

  // in this case we need to check all the remote provided are still provided
  await Promise.all(
    Object.entries(remoteProvides).map(
      async ([contractName, remoteContract]) => {
        const localContract = localProvides[contractName] as
          | JSONSchema
          | undefined;

        if (localContract === undefined) {
          throw new Error(`Expected to find local contract: ${contractName}`);
        }

        const { removalsFound } = await JsonSchemaDiff.diffSchemas({
          // @ts-ignore this is not well typed
          sourceSchema: remoteContract,
          // @ts-ignore this is not well typed
          destinationSchema: localContract,
        });

        if (removalsFound) {
          throw new Error(
            `Unexpected removal in provided contract: ${contractName}`,
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
 * @param localContracts
 * @param remoteContracts
 */
const validateConsumerFirstDeployment = async (
  localContracts: ServerlessContracts,
  remoteContracts: RemoteServerlessContracts,
): Promise<void> => {
  const { consumes: localConsumes } = localContracts;
  const { consumes: remoteConsumes } = remoteContracts;

  // the local version does not consume more than the remote
  await Promise.all(
    Object.entries(localConsumes).map(async ([contractName, localContract]) => {
      const remoteContract = remoteConsumes[contractName] as
        | JSONSchema
        | undefined;

      if (remoteContract === undefined) {
        throw new Error(`Expected to find remote contract: ${contractName}`);
      }

      const { additionsFound } = await JsonSchemaDiff.diffSchemas({
        // @ts-ignore this is not well typed
        sourceSchema: remoteContract,
        // @ts-ignore this is not well typed
        destinationSchema: localContract,
      });

      if (additionsFound) {
        throw new Error(
          `Unexpected addition in consumed contract: ${contractName}`,
        );
      }
    }),
  );
};
