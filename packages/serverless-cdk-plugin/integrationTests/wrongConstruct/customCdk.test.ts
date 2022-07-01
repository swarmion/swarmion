import runServerless from '@serverless/test/run-serverless';

describe('customCdK', () => {
  it('throws when custom.myConstruct is not a construct', async () => {
    await expect(
      runServerless('../../node_modules/serverless', {
        command: 'package',
        cwd: __dirname,
      }),
    ).rejects.toThrow('custom.myConstruct is not a construct');
  });
});
