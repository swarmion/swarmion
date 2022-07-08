import runServerless from '@serverless/test/run-serverless';

describe('customCdK', () => {
  it('throws when serverlessConstruct is not a construct', async () => {
    await expect(
      runServerless('../../node_modules/serverless', {
        command: 'package',
        cwd: __dirname,
      }),
    ).rejects.toThrow('serverlessConstruct is not a ServerlessConstruct');
  });
});
