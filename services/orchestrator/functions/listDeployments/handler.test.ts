import { listDeploymentsContract } from '@swarmion/orchestrator-contracts';
import { getMockHandlerInput } from '@swarmion/serverless-contracts/test-utils';

import { main } from './handler';

beforeEach(() => {
  console.error = vi.fn();
  console.log = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('listDeployments handler', () => {
  it('should return a list of deployments', async () => {
    const result = await main(
      ...getMockHandlerInput(listDeploymentsContract, {
        queryStringParameters: { applicationId: 'applicationId' },
      }),
    );

    expect(console.log).toHaveBeenCalledWith({
      applicationId: 'applicationId',
    });

    expect(result).toMatchObject({
      body: JSON.stringify({ id: 'coucou' }),
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 200,
    });
  });

  it('should return an error when a non-existing param is passed', async () => {
    const result = await main(
      ...getMockHandlerInput(listDeploymentsContract, {
        queryStringParameters: { nonExistingParam: 'foo' },
      }),
    );

    expect(result).toMatchObject({
      body: 'Invalid input',
      headers: undefined,
      statusCode: 400,
    });
  });
});
