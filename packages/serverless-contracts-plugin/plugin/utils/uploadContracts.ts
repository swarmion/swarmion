import crypto from 'crypto';
import * as Serverless from 'serverless';
import simpleGit from 'simple-git';

import { Logging } from 'plugin/serverlessContractsPlugin';
import { RemoteServerlessContracts } from 'types/serviceOptions';

import { COMPILED_CONTRACTS_FILE_NAME, CONTRACTS_VERSION } from './constants';
import { listLocalContracts } from './listLocalContracts';

export const uploadContracts = async (
  serverless: Serverless,
  log: Logging['log'],
): Promise<void> => {
  // @ts-ignore @types/serverless does not know this prop
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (serverless.service.provider.shouldNotDeploy) {
    log.info('Service files not changed. Skipping contracts upload...');
  }
  const provider = serverless.getProvider('aws');
  const bucketName = await provider.getServerlessDeploymentBucketName();
  const artifactDirectoryName = serverless.service.package
    .artifactDirectoryName as string;

  const contracts = listLocalContracts(serverless);

  const git = simpleGit();

  const gitCommit = await git.revparse('HEAD');

  const contractsToUpload: RemoteServerlessContracts = {
    ...contracts,
    gitCommit,
    contractsVersion: CONTRACTS_VERSION,
  };

  const fileHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(contractsToUpload))
    .digest('base64');

  const params = {
    Bucket: bucketName,
    Key: `${artifactDirectoryName}/${COMPILED_CONTRACTS_FILE_NAME}`,
    Body: JSON.stringify(contractsToUpload),
    ContentType: 'application/json',
    Metadata: {
      filesha256: fileHash,
    },
  };

  log.info('Uploading contracts file to S3...');

  await provider.request('S3', 'upload', params);
};
