/** Helper to be used in config.ts files to retrieve the path of the handler. */
const getHandlerPath = (directoryPath: string): string => {
  const processRunLocation = process.cwd();

  return directoryPath.replace(processRunLocation + '/', '') + '/handler.main';
};

export default getHandlerPath;
