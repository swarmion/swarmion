import runServerless from '@serverless/test/run-serverless';
import { join } from 'path';

describe('customCdK', () => {
  it('throws when no construct is provided', async () => {
    await expect(
      runServerless(join(__dirname, '../../node_modules/serverless'), {
        command: 'package',
        cwd: __dirname,
      }),
    ).rejects.toThrow('Missing custom.cdkPlugin.stack property');
  });
});
