import crypto from 'crypto';
import * as Serverless from 'serverless';
import Plugin from 'serverless/classes/Plugin';
import { simpleGit } from 'simple-git';

import { RemoteServerlessContractSchemas } from 'types/serviceOptions';

import { COMPILED_CONTRACTS_FILE_NAME, CONTRACTS_VERSION } from './constants';
import { listLocalContractSchemas } from './listLocalContractSchemas';

export const uploadContractSchemas = async (
  serverless: Serverless,
  log: Plugin.Logging['log'],
): Promise<void> => {
  // @ts-ignore @types/serverless does not know this prop
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (serverless.service.provider.shouldNotDeploy) {
    log.info('Service files not changed. Skipping contract schemas upload...');
  }
  const provider = serverless.getProvider('aws');
  const bucketName = await provider.getServerlessDeploymentBucketName();
  const artifactDirectoryName = serverless.service.package
    .artifactDirectoryName as string;

  const contractSchemas = listLocalContractSchemas(serverless);

  const git = simpleGit();

  const gitCommit = await git.revparse('HEAD');

  const contractSchemasToUpload: RemoteServerlessContractSchemas = {
    ...contractSchemas,
    gitCommit,
    contractsVersion: CONTRACTS_VERSION,
  };

  const fileHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(contractSchemasToUpload))
    .digest('base64');

  const params = {
    Bucket: bucketName,
    Key: `${artifactDirectoryName}/${COMPILED_CONTRACTS_FILE_NAME}`,
    Body: JSON.stringify(contractSchemasToUpload),
    ContentType: 'application/json',
    Metadata: {
      filesha256: fileHash,
    },
  };

  log.info('Uploading contract schemas file to S3...');

  await provider.request('S3', 'upload', params);
};
