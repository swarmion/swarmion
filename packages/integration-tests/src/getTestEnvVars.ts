export const getTestEnvVars = <
  EnvVarsType extends Record<string, string>,
>(): EnvVarsType =>
  new Proxy<EnvVarsType>({} as EnvVarsType, {
    get: (_, envVar) => {
      if (typeof envVar !== 'string') {
        throw new Error('Config can only be accessed with a string');
      }
      const envVarValue = process.env[envVar];
      if (envVarValue !== undefined) {
        return envVarValue;
      }
      throw new Error(
        `Cannot use TestEnvVars.${String(
          envVar,
        )}. Please make sure you defined TestEnvVar in your CDK stack and deployed it.`,
      );
    },
  });
