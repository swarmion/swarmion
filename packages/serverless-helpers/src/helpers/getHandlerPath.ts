type GetHandlerPathProps = {
  fileName?: string;
};

/** Helper to be used in config.ts files to retrieve the path of the handler. */
export const getHandlerPath = (
  directoryPath: string,
  props?: GetHandlerPathProps,
): string => {
  const processRunLocation = process.cwd();

  const fileName = props?.fileName ?? 'handler';

  return (
    directoryPath.replace(processRunLocation + '/', '') + `/${fileName}.main`
  );
};
