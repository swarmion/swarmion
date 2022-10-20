import * as path from 'path';

/** Helper to be used in config.ts files to retrieve the path of the handler. */
const getHandlerPath = (directoryPath: string): string => {
  const processRunLocation = process.cwd();

  const handlerPath = directoryPath.replace(processRunLocation + path.sep, '') + path.sep + 'handler.main';

  // for cross-platform support, handler would look like: functions/{funcName}/handler.main
  const handlerPathSplit = handlerPath.split('functions', 2);
  if (handlerPathSplit[1] === undefined) throw new Error('handler path should start with functions/...');

  return 'functions' + handlerPathSplit[1].split(path.sep).join('/');
};

export default getHandlerPath;
