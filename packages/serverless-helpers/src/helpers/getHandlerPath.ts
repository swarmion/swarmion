/** Helper to be used in config.ts files to retrieve the path of the handler. */
export const getHandlerPath = (directoryPath: string): string => {
  const processRunLocation = process.cwd();

  return directoryPath.replace(processRunLocation + '/', '') + '/handler.main';
};
