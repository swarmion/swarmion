import runServerless from '@serverless/test/run-serverless';

describe('customCdK', () => {
  it('throws when no construct is provided', async () => {
    await expect(
      runServerless('../../node_modules/serverless', {
        command: 'package',
        cwd: __dirname,
      }),
    ).rejects.toThrow('Missing serverlessConstruct property');
  });
});
