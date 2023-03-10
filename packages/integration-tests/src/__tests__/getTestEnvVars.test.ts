import { getTestEnvVars } from '../getTestEnvVars';

type TestEnvVarsType = {
  TOTO: string;
};
const ENV_VARS = getTestEnvVars<TestEnvVarsType>();
describe('getTestEnvVars', () => {
  it('returns the value of the env var', () => {
    process.env.TOTO = 'toto';
    expect(ENV_VARS.TOTO).toEqual('toto');
  });
  it('throws type and runtime errors if the env var is not defined', () => {
    // @ts-expect-error expect ENV_VARS.TITI to be a type error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    expect(() => ENV_VARS.TITI).toThrowError(
      'Cannot use TestEnvVars.TITI. Please make sure you defined TestEnvVar in your CDK stack and deployed it.',
    );
  });
});
