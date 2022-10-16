import * as path from "path";

/** Helper to be used in config.ts files to retrieve the path of the handler. */
const getHandlerPath = (directoryPath: string): string => {
  const processRunLocation = process.cwd();

  return directoryPath.replace(processRunLocation + path.sep, '') + path.sep + 'handler.main';
};

export default getHandlerPath;
