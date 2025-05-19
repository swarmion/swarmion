import {
  onDeploymentRequestedContract,
  onDeploymentUpdatedContract,
} from '@swarmion/orchestrator-contracts';
import { getMultipleEventBridgeHandler } from '@swarmion/serverless-contracts';

import { ajv } from 'libs/ajv';

export const main = getMultipleEventBridgeHandler(
  [onDeploymentRequestedContract, onDeploymentUpdatedContract],
  { ajv },
)(async event => {
  const { applicationId, eventId, serviceId } = event.detail;

  await Promise.resolve();

  console.log({ applicationId, eventId, serviceId });
});
