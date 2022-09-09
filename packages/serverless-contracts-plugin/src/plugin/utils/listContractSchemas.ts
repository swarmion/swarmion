import { mkdir, rmdir, writeFile } from 'fs/promises';
import Serverless from 'serverless';

import { listLocalContractSchemas } from './listLocalContractSchemas';
import { listRemoteContractSchemas } from './listRemoteContractSchemas';

export const listContractSchemas = async (
  serverless: Serverless,
): Promise<void> => {
  const localContractSchemas = listLocalContractSchemas(serverless);
  const remoteContractSchemas = await listRemoteContractSchemas(serverless);
  await rmdir('.swarmion', { recursive: true });
  await mkdir('.swarmion');
  await writeFile(
    '.swarmion/contracts.json',
    JSON.stringify({
      localContractSchemas,
      remoteContractSchemas,
    }),
  );
};
