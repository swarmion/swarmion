/** Helper to be used in CDK config.ts files to retrieve the path of the handler. */
export const getCdkHandlerPath = (directoryPath: string): string => {
  const processRunLocation = process.cwd();

  return directoryPath.replace(processRunLocation + '/', '') + '/handler.ts';
};
