import fetch from 'node-fetch';
import { expect } from 'vitest';

import { TEST_ENV_VARS } from 'testEnvVars';

describe('listDeployments', () => {
  it('should put a service event entity inside the orchestrator table', async () => {
    const response = await fetch(`${TEST_ENV_VARS.API_URL}/deployments`);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ id: 'coucou' });
    expect(response.headers).toBe({
      'Content-Type': 'application/json',
      customHeader: 'customHeader',
    });
  });
});
