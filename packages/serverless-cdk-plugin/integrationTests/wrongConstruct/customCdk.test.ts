import runServerless from '@serverless/test/run-serverless';

describe('customCdK', () => {
  it('throws when cdkConstruct is not a construct', async () => {
    await expect(
      runServerless('../../node_modules/serverless', {
        command: 'package',
        cwd: __dirname,
      }),
    ).rejects.toThrow('cdkConstruct is not a construct');
  });
});
