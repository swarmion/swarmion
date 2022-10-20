import * as path from 'path';

/** Helper to be used in config.ts files to retrieve the path of the handler. */
const getHandlerPath = (directoryPath: string): string => {
  const processRunLocation = process.cwd();

  const handlerPath = directoryPath.replace(processRunLocation + path.sep, '') + path.sep + 'handler.main';

  // for crossplatform support, handler would look like: functions/{funcName}/handler.main
  return 'functions' + handlerPath.split('functions', 2)[1].split(path.sep).join('/');
};

export default getHandlerPath;
