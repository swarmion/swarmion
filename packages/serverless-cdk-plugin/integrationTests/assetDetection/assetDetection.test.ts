import runServerless from '@serverless/test/run-serverless';

describe('assetDetection', () => {
  it('should create all required resources', async () => {
    await expect(() =>
      runServerless('../../node_modules/serverless', {
        command: 'package',
        cwd: __dirname,
      }),
    ).rejects.toThrow(
      'cannot be deployed because it needs the bootstrap stack',
    );
  });
});
