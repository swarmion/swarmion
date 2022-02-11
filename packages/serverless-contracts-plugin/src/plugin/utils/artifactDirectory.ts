/**
 * Extracts the timestamp from the name of the directory.
 *
 * @param artifactDirectoryName the built directory name: format is serverless/{service}/{stage}/{timestamp}
 */
export const getTimestampFromArtifactDirectoryName = (
  artifactDirectoryName: string,
): string => {
  const [, , , timestamp] = artifactDirectoryName.split('/');

  return timestamp;
};

/**
 *
 * regenerates the artifactDirectoryName of the previous deployment in order to retrieve the deployed version
 * of the contracts
 *
 * @param prefix
 * @param service
 * @param stage
 * @param previousTimestamp
 * @returns serverless/{service}/{stage}/{timestamp}
 *
 */
export const buildPreviousDeploymentArtifactDirectoryName = (
  prefix: string,
  service: string,
  stage: string,
  previousTimestamp: string,
): string => {
  return [prefix, service, stage, previousTimestamp].join('/');
};
