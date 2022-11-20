import { getHandler } from '@swarmion/serverless-contracts';

import { healthContract } from '@swarmion-with-cdk/core-contracts';

export const main = getHandler(healthContract)(async event => {
  console.log(JSON.stringify(event, null, 2));

  return Promise.resolve({
    message: `The received message was ${event.queryStringParameters.message} 🛩️`,
  });
});
