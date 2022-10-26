import { AWS } from '@serverless/typescript';

const MAX_AWS_LAMBDA_NAME_LENGTH = 64;
const STAGE = 'production';

const getFunctionNames = (config: AWS): string[] => {
  return Object.keys(config.functions ?? []);
};

const getFullFunctionName = (config: AWS, functionName: string): string =>
  `${config.service}-${STAGE}-${functionName}`;

/**
 * Test that all the automatically generated function names will pass the 64 characters AWS limit
 *
 * In Swarmion, we use the `dev`, `staging`, `production` convention, so we test with the longest suffix
 *
 * @param config serverless configuration object
 */
export const testFunctionNames = (config: AWS): void => {
  const functionNames = getFunctionNames(config);
  if (functionNames.length === 0) {
    it('has no functions declared', () => {
      expect(functionNames).toEqual([]);
    });

    return;
  }

  it.each(functionNames)(
    `has function %s which generated name contains less than or equal to ${MAX_AWS_LAMBDA_NAME_LENGTH} chars`,
    (functionName: string) => {
      const fullFunctionName = getFullFunctionName(config, functionName);

      expect(fullFunctionName.length).toBeLessThanOrEqual(
        MAX_AWS_LAMBDA_NAME_LENGTH,
      );
    },
  );
};
